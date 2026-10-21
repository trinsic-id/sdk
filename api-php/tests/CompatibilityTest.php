<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
require_once __DIR__ . '/CompatibilitySupport.php';
use Trinsic\Compatibility\CompatibilitySupport;
use Trinsic\Compatibility\SkippedCompatibilityCase;

final class CompatibilityTest extends TestCase
{
    private static CompatibilitySupport $support;

    public static function setUpBeforeClass(): void
    {
        self::$support = new CompatibilitySupport();
    }

    public static function tearDownAfterClass(): void
    {
        self::$support->writeResults();
    }

    public function testListProviders(): void { $this->case('api.providers.list', fn() => self::assertNotNull(self::$support->invoke(self::$support->providers, 'listProviders'))); }
    public function testGetVerificationProfile(): void { $this->case('api.verification-profiles.get-by-id', fn() => self::assertNotNull(self::$support->invoke(self::$support->profiles, 'getVerificationProfileById', [self::$support->profileId()]))); }
    public function testListVerificationProfiles(): void { $this->case('api.verification-profiles.list', fn() => self::assertNotNull(self::$support->invoke(self::$support->profiles, 'listVerificationProfiles', [1, 100]))); }
    public function testListSessions(): void { $this->case('api.sessions.list', fn() => self::assertNotNull(self::$support->invoke(self::$support->sessions, 'listSessions', [self::$support->profileId()]))); }
    public function testListRedirectUris(): void { $this->case('api.redirect-uris.list', fn() => self::assertNotNull(self::$support->invoke(self::$support->redirects, 'callList'))); }

    public function testGetProviderDirectly(): void
    {
        if (!method_exists(self::$support->providers, 'getProvider')) $this->skipCase('api.providers.get', 'This SDK does not expose getProvider.');
        $this->case('api.providers.get', fn() => self::assertNotNull(self::$support->invoke(self::$support->providers, 'getProvider', ['trinsic-test-redirect'])));
    }

    public function testHostedSessionLifecycleDirectly(): void
    {
        $this->case('api.sessions.create-hosted-provider', function (): void {
            $session = self::$support->invoke(self::$support->sessions, 'createHostedProviderSession', [$this->hostedRequest()]);
            $this->cancel($session);
        });
    }

    public function testCreateDirectSession(): void
    {
        $this->case('api.sessions.create-direct-provider', function (): void {
            $session = $this->createDirectSession();
            try {
                self::assertNotNull($session);
            } finally {
                $this->cleanup($session);
            }
        });
    }

    public function testGetDirectSession(): void
    {
        $this->case('api.sessions.get', function (): void {
            $session = $this->createDirectSession();
            try {
                self::assertNotNull(self::$support->invoke(self::$support->sessions, 'getSession', [$this->sessionId($session)]));
            } finally {
                $this->cleanup($session);
            }
        });
    }

    public function testCancelDirectSession(): void
    {
        $this->case('api.sessions.cancel', fn() => $this->cancel($this->createDirectSession()));
    }

    public function testGetSessionResult(): void
    {
        $this->case('api.sessions.get-result', fn() => $this->completedSessionResult());
    }

    public function testGetSessionAttachment(): void
    {
        $this->skippableCase('api.sessions.get-attachment', function (): void {
            [$session, $accessKey, $result] = $this->completedSessionResultOrSkip();
            $attachmentId = self::$support->attachmentId($result);
            if (!$attachmentId) self::$support->skipFromCase('The redirect test session did not produce an attachment.');
            self::$support->invoke(self::$support->sessions, 'getAttachment', [$this->sessionId($session), $attachmentId, self::$support->model('GetAttachmentRequest', ['results_access_key' => $accessKey])]);
        });
    }

    public function testRedactSession(): void
    {
        $this->skippableCase('api.sessions.redact', function (): void {
            [$session] = $this->completedSessionResultOrSkip();
            self::$support->invoke(self::$support->sessions, 'redactSession', [$this->sessionId($session)]);
        });
    }

    public function testRecommendProviders(): void
    {
        $this->case('api.sessions.recommend-providers', function (): void {
            $request = self::$support->model('RecommendProvidersRequest', ['verification_profile_id' => self::$support->profileId(), 'health' => 'All']);
            self::assertNotNull(self::$support->invoke(self::$support->sessions, 'recommendProviders', [$request]));
        });
    }

    #[DataProvider('providerOutputFixtures')]
    public function testProviderOutputRoundTrip(?array $fixture): void
    {
        if ($fixture === null) $this->skipCase('serialization.provider-output-round-trip', 'No shared PSO fixture cache was available.');
        $parameters = ['providerId' => $fixture['providerId']];
        if (isset($fixture['sdkModelName'])) $parameters['sdkModelName'] = $fixture['sdkModelName'];
        if (empty($fixture['hasPublicSdkModel'])) $this->skipCase('serialization.provider-output-round-trip', 'Provider has no public Swagger provider-specific output model.', $parameters);
        $class = 'Trinsic\\Api\\Model\\' . $fixture['sdkModelName'];
        if (!class_exists($class)) {
            if (getenv('SDK_IS_CURRENT') === 'true' && !self::$support->allowMissingPsoModels()) {
                $this->case('serialization.provider-output-round-trip', fn() => throw new \RuntimeException("Connect declares {$fixture['providerId']}'s {$fixture['sdkModelName']} output as public, but this SDK does not expose {$fixture['sdkModelName']}."), $parameters);
            }
            $reason = getenv('SDK_IS_CURRENT') === 'true'
                ? 'Missing public provider-output models are temporarily allowed by SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS.'
                : 'The published SDK does not expose this provider-output model.';
            $this->skipCase('serialization.provider-output-round-trip', $reason, $parameters);
        }
        $this->case('serialization.provider-output-round-trip', function () use ($class, $fixture): void {
            if (!isset($fixture['output'])) throw new \RuntimeException('Cached fixture omitted output.');
            $model = \Trinsic\Api\ObjectSerializer::deserialize(json_encode($fixture['output']), $class, []);
            $serialized = json_decode(json_encode(\Trinsic\Api\ObjectSerializer::sanitizeForSerialization($model), JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR);
            self::$support->compareJson($serialized, $fixture['serializationOutput'] ?? $fixture['output'], $fixture['providerId'], getenv('SDK_IS_CURRENT') === 'true');
        }, $parameters);
    }

    /** @return iterable<string, array{?array}> */
    public static function providerOutputFixtures(): iterable
    {
        $cache = getenv('SDK_COMPATIBILITY_PSO_FIXTURES_PATH');
        if (!$cache || !is_file($cache)) {
            yield 'no shared fixture cache' => [null];
            return;
        }
        foreach (json_decode((string) file_get_contents($cache), true, flags: JSON_THROW_ON_ERROR)['fixtures'] ?? [] as $fixture) {
            yield $fixture['providerId'] => [$fixture];
        }
    }

    private function case(string $id, callable $action, array $parameters = []): mixed
    {
        return self::$support->record($id, $action, $parameters);
    }

    private function skipCase(string $id, string $reason, array $parameters = []): never
    {
        self::$support->skip($id, $reason, $parameters);
        self::markTestSkipped($reason);
    }

    private function skippableCase(string $id, callable $action): void
    {
        try {
            $this->case($id, $action);
        } catch (SkippedCompatibilityCase $error) {
            $this->markTestSkipped($error->getMessage());
        }
    }

    private function hostedRequest(): object
    {
        return self::$support->model('CreateHostedProviderSessionRequest', ['provider' => 'trinsic-test-redirect', 'verification_profile_id' => self::$support->profileId(), 'redirect_url' => self::$support->redirectUri(), 'enable_redirect_backwards_compatibility' => false]);
    }

    private function createDirectSession(): object
    {
        return self::$support->invoke(self::$support->sessions, 'createDirectProviderSession', [self::$support->model('CreateDirectProviderSessionRequest', ['provider' => 'trinsic-test-redirect', 'verification_profile_id' => self::$support->profileId(), 'redirect_url' => self::$support->redirectUri(), 'enable_redirect_backwards_compatibility' => false, 'capabilities' => ['LaunchBrowser', 'CaptureRedirect'], 'fallback_to_hosted_ui' => false])]);
    }

    private function sessionId(object $session): string
    {
        $id = self::$support->value($session, 'sessionId');
        self::assertIsString($id);
        self::assertNotSame('', $id);
        return $id;
    }

    private function cancel(object $session): void
    {
        self::$support->invoke(self::$support->sessions, 'cancelSession', [$this->sessionId($session)]);
    }

    private function cleanup(object $session): void
    {
        try {
            $this->cancel($session);
        } catch (\Throwable) {
            // Cleanup is not the compatibility operation under test.
        }
    }

    /** @return array{object, string, mixed} */
    private function completedSessionResult(): array
    {
        $session = $this->createDirectSession();
        [$token, $accessKey] = self::$support->completedRedirectSession($session);
        $result = self::$support->invoke(self::$support->sessions, 'getSessionResult', [$this->sessionId($session), self::$support->model('GetSessionResultRequest', ['redirect_token' => $token, 'results_access_key' => $accessKey])]);
        return [$session, $accessKey, $result];
    }

    /** @return array{object, string, mixed} */
    private function completedSessionResultOrSkip(): array
    {
        try {
            return $this->completedSessionResult();
        } catch (\Throwable) {
            self::$support->skipFromCase('Redirect-session setup or result retrieval failed.');
        }
    }
}
