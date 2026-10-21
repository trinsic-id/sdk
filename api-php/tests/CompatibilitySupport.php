<?php
declare(strict_types=1);

namespace Trinsic\Compatibility;

use Trinsic\Api\Configuration;

final class SkippedCompatibilityCase extends \RuntimeException
{
}

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
        } catch (SkippedCompatibilityCase $skip) {
            $this->results[] = ['id' => $id, 'status' => 'skipped', 'durationMs' => (int) ((microtime(true) - $started) * 1000), 'parameters' => $parameters ?: null, 'skipReason' => $skip->getMessage()];
            throw $skip;
        } catch (\Throwable $error) {
            $this->results[] = ['id' => $id, 'status' => 'failed', 'durationMs' => (int) ((microtime(true) - $started) * 1000), 'parameters' => $parameters ?: null, 'failure' => ['name' => $error::class, 'message' => $error->getMessage()]];
            throw $error;
        }
    }

    public function skip(string $id, string $reason, array $parameters = []): void
    {
        $this->results[] = ['id' => $id, 'status' => 'skipped', 'durationMs' => 0, 'parameters' => $parameters ?: null, 'skipReason' => $reason];
    }

    public function skipFromCase(string $reason): never
    {
        throw new SkippedCompatibilityCase($reason);
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

    public function value(mixed $object, string $property): mixed
    {
        $method = 'get' . ucfirst($property);
        return is_object($object) && method_exists($object, $method) ? $object->$method() : null;
    }

    public function redirectUri(): string
    {
        $page = $this->invoke($this->redirects, 'callList', [1, 100]);
        $data = json_decode((string) json_encode($page), true);
        $walk = function (mixed $value) use (&$walk): ?string {
            if (is_string($value) && preg_match('#^https?://#', $value)) return $value;
            if (is_array($value)) foreach ($value as $entry) {
                $found = $walk($entry);
                if ($found !== null) return $found;
            }
            return null;
        };
        return $walk($data) ?? throw new \RuntimeException('The test environment must have an HTTP(S) redirect URI.');
    }

    /** @return array{string, string} */
    public function completedRedirectSession(object $session): array
    {
        $browser = new \GuzzleHttp\Client(['allow_redirects' => false, 'cookies' => true, 'http_errors' => false]);
        $next = $this->value($session, 'nextStep');
        $launch = $this->value($next, 'content');
        if (!is_string($launch) || $launch === '') throw new \RuntimeException('Direct session omitted launch content.');
        [$status, $location, $source] = $this->browserFetch($browser, $launch);
        if ($status !== 302 || !$location) throw new \RuntimeException('Direct session launch did not redirect to the test integration.');
        $integration = $this->resolveUrl($source, $location);
        parse_str((string) parse_url($integration, PHP_URL_QUERY), $integrationQuery);
        $callback = $integrationQuery['redirectUrl'] ?? null;
        if (!is_string($callback) || $callback === '') throw new \RuntimeException('Test integration omitted redirectUrl.');
        $callbackUri = new \GuzzleHttp\Psr7\Uri($callback);
        parse_str($callbackUri->getQuery(), $callbackQuery);
        $callbackUri = $callbackUri->withQuery(http_build_query([...$callbackQuery, 'resultState' => 'success']));
        [, $location, $source] = $this->browserFetch($browser, (string) $callbackUri);
        if (!$location) throw new \RuntimeException('Test integration callback did not redirect.');
        [, $location, $source] = $this->browserFetch($browser, $this->resolveUrl($source, $location));
        if (!$location) throw new \RuntimeException('Verification completion did not redirect.');
        [, $location, $source] = $this->browserFetch($browser, $this->resolveUrl($source, $location));
        if (!$location) throw new \RuntimeException('Redirect completion did not redirect.');
        $application = $this->resolveUrl($source, $location);
        parse_str((string) parse_url($application, PHP_URL_QUERY), $applicationQuery);
        $token = $applicationQuery['redirectToken'] ?? null;
        $collection = $this->value($session, 'resultCollection');
        $key = $this->value($collection, 'resultsAccessKey');
        if (!is_string($token) || $token === '' || !is_string($key) || $key === '') throw new \RuntimeException('Completed redirect session omitted the redirect token or results access key.');
        return [$token, $key];
    }

    public function attachmentId(mixed $result): ?string
    {
        $identity = $this->value($result, 'identityData');
        $attachments = $this->value($identity, 'attachments');
        $first = is_array($attachments) ? $attachments[0] ?? null : null;
        $id = $this->value($first, 'id');
        return is_string($id) && $id !== '' ? $id : null;
    }

    public function allowMissingPsoModels(): bool
    {
        return in_array(strtolower((string) getenv('SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS')), ['1', 'true'], true);
    }

    public function compareJson(mixed $actual, mixed $expected, string $path, bool $exact): void
    {
        if (is_array($actual) && is_array($expected)) {
            if ($this->isList($actual) !== $this->isList($expected)) throw new \RuntimeException("$path JSON types differ.");
            foreach ($actual as $key => $value) {
                if (!array_key_exists($key, $expected)) {
                    if ($this->isList($actual)) throw new \RuntimeException("$path emitted an array value absent from fixture: $key.");
                    continue;
                }
                $this->compareJson($value, $expected[$key], $this->isList($actual) ? "$path[$key]" : "$path.$key", $exact);
            }
            if ($exact) {
                if ($this->isList($actual)) {
                    if (count($actual) !== count($expected)) throw new \RuntimeException("$path array lengths differ.");
                } else foreach ($expected as $key => $_) {
                    if (!array_key_exists($key, $actual)) throw new \RuntimeException("$path omitted field from fixture: $key.");
                }
            }
            return;
        }
        if ($actual !== $expected && !(is_string($actual) && is_string($expected) && $this->equivalentTimestamp($actual, $expected))) throw new \RuntimeException("$path values differ.");
    }

    /** @return array{int, ?string, string} */
    private function browserFetch(\GuzzleHttp\Client $browser, string $url): array
    {
        $response = $browser->get($url);
        return [$response->getStatusCode(), $response->getHeaderLine('Location') ?: null, $url];
    }

    private function resolveUrl(string $source, string $location): string
    {
        return (string) \GuzzleHttp\Psr7\UriResolver::resolve(new \GuzzleHttp\Psr7\Uri($source), new \GuzzleHttp\Psr7\Uri($location));
    }

    private function isList(array $value): bool
    {
        return $value === [] || array_keys($value) === range(0, count($value) - 1);
    }

    private function equivalentTimestamp(string $actual, string $expected): bool
    {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}[T ]/', $actual) || !preg_match('/^\d{4}-\d{2}-\d{2}[T ]/', $expected)) return false;
        try {
            return (new \DateTimeImmutable($actual))->getTimestamp() === (new \DateTimeImmutable($expected))->getTimestamp();
        } catch (\Exception) {
            return false;
        }
    }
}
