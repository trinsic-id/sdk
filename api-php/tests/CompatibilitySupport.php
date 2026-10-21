<?php
declare(strict_types=1);

namespace Trinsic\Compatibility;

use Trinsic\Api\Configuration;

final class CompatibilitySupport
{
    /** @var list<array<string, mixed>> */
    private array $results = [];

    public readonly object $providers;
    public readonly object $profiles;
    public readonly object $sessions;
    public readonly object $redirects;

    public function __construct()
    {
        $config = new Configuration();
        $config->setHost(rtrim((string) getenv('TRINSIC_TEST_BASE_URL'), '/'));
        $config->setAccessToken((string) getenv('TRINSIC_TEST_ACCESS_TOKEN'));
        $this->providers = new \Trinsic\Api\Api\ProvidersApi(null, $config);
        $this->profiles = new \Trinsic\Api\Api\VerificationProfilesApi(null, $config);
        $this->sessions = new \Trinsic\Api\Api\SessionsApi(null, $config);
        $this->redirects = new \Trinsic\Api\Api\RedirectUrisApi(null, $config);
    }

    public function record(string $id, callable $action, array $parameters = []): mixed
    {
        $started = microtime(true);
        try {
            $value = $action();
            $this->results[] = ['id' => $id, 'status' => 'passed', 'durationMs' => (int) ((microtime(true) - $started) * 1000), 'parameters' => $parameters ?: null];
            return $value;
        } catch (\Throwable $error) {
            $this->results[] = ['id' => $id, 'status' => 'failed', 'durationMs' => (int) ((microtime(true) - $started) * 1000), 'parameters' => $parameters ?: null, 'failure' => ['name' => $error::class, 'message' => $error->getMessage()]];
            throw $error;
        }
    }

    public function skip(string $id, string $reason, array $parameters = []): void
    {
        $this->results[] = ['id' => $id, 'status' => 'skipped', 'durationMs' => 0, 'parameters' => $parameters ?: null, 'skipReason' => $reason];
    }

    public function invoke(object $api, string $method, array $arguments = []): mixed
    {
        if (!method_exists($api, $method)) throw new \RuntimeException(get_class($api) . " does not expose $method.");
        return $api->$method(...$arguments);
    }

    public function model(string $name, array $values): object
    {
        $class = 'Trinsic\\Api\\Model\\' . $name;
        if (!class_exists($class)) throw new \RuntimeException("SDK does not expose $name.");
        return new $class($values);
    }

    public function profileId(): string
    {
        $value = getenv('TRINSIC_TEST_VERIFICATION_PROFILE_ID');
        if (!$value) throw new \RuntimeException('TRINSIC_TEST_VERIFICATION_PROFILE_ID is required.');
        return $value;
    }

    public function writeResults(): void
    {
        $output = getenv('SDK_COMPATIBILITY_RESULT_FILE');
        if ($output) file_put_contents($output, json_encode(['schemaVersion' => 1, 'testCases' => $this->results], JSON_PRETTY_PRINT) . "\n");
    }
}
