<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

/**
 * PHPUnit facade for the compatibility contract. The runner retains its
 * per-case result envelope, which the shared matrix evaluates after PHPUnit
 * has completed.
 */
final class CompatibilityTest extends TestCase
{
    /** @var array<string, array<int, array<string, mixed>>> */
    private static array $cases = [];

    public static function setUpBeforeClass(): void
    {
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
