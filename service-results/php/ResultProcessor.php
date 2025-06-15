<?php

namespace Trinsic\ServiceResults;

/**
 * Represents processed session result information
 */
class ProcessedResult
{
    public ?string $sessionId = null;
    public ?string $state = null;
    public ?string $failCode = null;
    public ?string $failReason = null;
    public int $resultCount = 0;
    public bool $hasVerifications = false;
    public ?\DateTime $completedAt = null;
    public \DateTime $processedAt;

    public function __construct()
    {
        $this->processedAt = new \DateTime();
    }

    /**
     * Convert to array
     * 
     * @return array
     */
    public function toArray(): array
    {
        return [
            'sessionId' => $this->sessionId,
            'state' => $this->state,
            'failCode' => $this->failCode,
            'failReason' => $this->failReason,
            'resultCount' => $this->resultCount,
            'hasVerifications' => $this->hasVerifications,
            'completedAt' => $this->completedAt?->format(\DateTime::ISO8601),
            'processedAt' => $this->processedAt->format(\DateTime::ISO8601),
        ];
    }
}

/**
 * Utility class for processing and validating session results
 */
class ResultProcessor
{
    /**
     * Validates an ExchangeResultRequest
     * 
     * @param ExchangeResultRequest $request
     * @throws ValidationException if validation fails
     */
    public static function validateRequest(ExchangeResultRequest $request): void
    {
        if ($request === null) {
            throw new ValidationException('Request cannot be null');
        }

        $request->validate();
    }

    /**
     * Validates multiple requests
     * 
     * @param ExchangeResultRequest[] $requests
     * @return array{valid: ExchangeResultRequest[], invalid: array}
     */
    public static function validateMultipleRequests(array $requests): array
    {
        $valid = [];
        $invalid = [];

        foreach ($requests as $index => $request) {
            try {
                self::validateRequest($request);
                $valid[] = $request;
            } catch (ValidationException $e) {
                $invalid[] = [
                    'index' => $index,
                    'request' => $request,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return [
            'valid' => $valid,
            'invalid' => $invalid,
        ];
    }

    /**
     * Processes a session result and extracts common information
     * 
     * @param mixed $result The session result to process
     * @return ProcessedResult
     * @throws \InvalidArgumentException if result is null
     */
    public static function processSessionResult($result): ProcessedResult
    {
        if ($result === null) {
            throw new \InvalidArgumentException('Result cannot be null');
        }

        $processed = new ProcessedResult();

        // Extract fields from result (adjust based on actual API response structure)
        if (is_array($result) || is_object($result)) {
            $data = is_object($result) ? (array) $result : $result;
            
            // Extract session information
            $session = $data['session'] ?? $data;
            
            if (is_array($session) || is_object($session)) {
                $sessionData = is_object($session) ? (array) $session : $session;
                
                $processed->sessionId = $sessionData['id'] ?? $sessionData['sessionId'] ?? null;
                $processed->state = $sessionData['state'] ?? null;
                $processed->failCode = $sessionData['failCode'] ?? null;
                $processed->failReason = $sessionData['failReason'] ?? null;
                
                $results = $sessionData['result'] ?? [];
                $processed->resultCount = is_array($results) ? count($results) : 0;
                $processed->hasVerifications = $processed->resultCount > 0;
                
                if (isset($sessionData['updatedAt'])) {
                    $processed->completedAt = new \DateTime($sessionData['updatedAt']);
                }
            }
        }

        return $processed;
    }

    /**
     * Sanitizes a request for logging (removes sensitive data)
     * 
     * @param ExchangeResultRequest $request
     * @return array
     */
    public static function sanitizeForLogging(ExchangeResultRequest $request): array
    {
        return [
            'sessionId' => $request->getSessionId(),
            'resultsAccessKey' => '[REDACTED]',
        ];
    }

    /**
     * Sanitizes multiple requests for logging
     * 
     * @param ExchangeResultRequest[] $requests
     * @return array
     */
    public static function sanitizeMultipleForLogging(array $requests): array
    {
        return array_map([self::class, 'sanitizeForLogging'], $requests);
    }

    /**
     * Validates that a value is a valid UUID
     * 
     * @param string $uuid
     * @return bool
     */
    public static function isValidUuid(string $uuid): bool
    {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $uuid) === 1;
    }
}