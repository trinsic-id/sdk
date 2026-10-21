<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/CompatibilitySupport.php';
use Trinsic\Compatibility\CompatibilitySupport;

/**
 * PHPUnit facade for the compatibility contract. The runner retains its
 * per-case result envelope, which the shared matrix evaluates after PHPUnit
 * has completed.
 */
final class CompatibilityTest extends TestCase
{
    /** @var array<string, array<int, array<string, mixed>>> */
    private static array $cases = [];
    private static CompatibilitySupport $support;

    public static function setUpBeforeClass(): void
    {
        self::$support = new CompatibilitySupport();
        $runner = __DIR__ . '/run_target.php';
        $autoload = getenv('SDK_COMPATIBILITY_AUTOLOAD') ?: __DIR__ . '/vendor/autoload.php';
        $command = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($runner) . ' ' . escapeshellarg($autoload);
        exec($command, $output, $status);
        $result = getenv('SDK_COMPATIBILITY_RESULT_FILE');
        self::assertNotFalse($result, 'SDK_COMPATIBILITY_RESULT_FILE is required.');
        self::assertFileExists($result, implode("\n", $output));
        $report = json_decode((string) file_get_contents($result), true, flags: JSON_THROW_ON_ERROR);
        foreach ($report['testCases'] ?? [] as $case) self::$cases[$case['id']][] = $case;
    }

    public function testListProvidersDirectly(): void { self::assertNotNull(self::$support->invoke(self::$support->providers, 'listProviders')); }
    public function testGetVerificationProfileDirectly(): void { self::assertNotNull(self::$support->invoke(self::$support->profiles, 'getVerificationProfileById', [self::$support->profileId()])); }
    public function testListVerificationProfilesDirectly(): void { self::assertNotNull(self::$support->invoke(self::$support->profiles, 'listVerificationProfiles', [1, 100])); }
    public function testListSessionsDirectly(): void { self::assertNotNull(self::$support->invoke(self::$support->sessions, 'listSessions', [self::$support->profileId()])); }
    public function testListRedirectUrisDirectly(): void { self::assertNotNull(self::$support->invoke(self::$support->redirects, 'callList')); }

    public function testGetProviderDirectly(): void
    {
        if (!method_exists(self::$support->providers, 'getProvider')) self::markTestSkipped('This SDK does not expose getProvider.');
        self::assertNotNull(self::$support->invoke(self::$support->providers, 'getProvider', ['trinsic-test-redirect']));
    }

    public function testHostedSessionLifecycleDirectly(): void
    {
        $session = self::$support->invoke(self::$support->sessions, 'createHostedProviderSession', [self::$support->model('CreateHostedProviderSessionRequest', ['provider' => 'trinsic-test-redirect', 'verification_profile_id' => self::$support->profileId(), 'redirect_url' => $this->redirectUri(), 'enable_redirect_backwards_compatibility' => false])]);
        self::assertNotNull($session);
        self::$support->invoke(self::$support->sessions, 'cancelSession', [$session->getSessionId()]);
    }

    public function testDirectSessionCanBeReadAndCancelledDirectly(): void
    {
        $session = self::$support->invoke(self::$support->sessions, 'createDirectProviderSession', [self::$support->model('CreateDirectProviderSessionRequest', ['provider' => 'trinsic-test-redirect', 'verification_profile_id' => self::$support->profileId(), 'redirect_url' => $this->redirectUri(), 'capabilities' => ['LaunchBrowser', 'CaptureRedirect'], 'fallback_to_hosted_ui' => false, 'enable_redirect_backwards_compatibility' => false])]);
        self::assertNotNull(self::$support->invoke(self::$support->sessions, 'getSession', [$session->getSessionId()]));
        self::$support->invoke(self::$support->sessions, 'cancelSession', [$session->getSessionId()]);
    }

    public function testRecommendProvidersDirectly(): void
    {
        $request = self::$support->model('RecommendProvidersRequest', ['verification_profile_id' => self::$support->profileId(), 'health' => 'All']);
        self::assertNotNull(self::$support->invoke(self::$support->sessions, 'recommendProviders', [$request]));
    }

    private function redirectUri(): string
    {
        $json = json_encode(self::$support->invoke(self::$support->redirects, 'callList'));
        self::assertMatchesRegularExpression('#https?://[^"\\s]+#', (string) $json);
        preg_match('#https?://[^"\\s]+#', (string) $json, $match);
        return $match[0];
    }

    /** @dataProvider apiCases */
    public function testApiContract(string $id): void { $this->assertCasesPass($id); }

    /** @return iterable<string, array{string}> */
    public static function apiCases(): iterable
    {
        foreach ([
            'api.providers.list', 'api.verification-profiles.get-by-id', 'api.verification-profiles.list',
            'api.sessions.list', 'api.redirect-uris.list', 'api.providers.get',
            'api.sessions.create-hosted-provider', 'api.sessions.create-direct-provider',
            'api.sessions.get', 'api.sessions.cancel', 'api.sessions.get-result',
            'api.sessions.get-attachment', 'api.sessions.redact', 'api.sessions.recommend-providers',
        ] as $id) yield $id => [$id];
    }

    public function testProviderOutputContractProducesCases(): void
    {
        self::assertArrayHasKey('serialization.provider-output-round-trip', self::$cases);
    }

    private function assertCasesPass(string $id): void
    {
        self::assertArrayHasKey($id, self::$cases);
        $failures = array_filter(self::$cases[$id], static fn(array $case): bool => $case['status'] === 'failed');
        self::assertSame([], $failures, json_encode($failures, JSON_PRETTY_PRINT));
    }
}
