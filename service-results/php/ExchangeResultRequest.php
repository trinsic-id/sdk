<?php

namespace Trinsic\ServiceResults;

/**
 * Standard request model for exchanging session result access keys
 */
class ExchangeResultRequest
{
    private string $sessionId;
    private string $resultsAccessKey;

    /**
     * Constructor
     * 
     * @param string $sessionId The unique identifier for the verification session
     * @param string $resultsAccessKey The access key needed to retrieve session results
     */
    public function __construct(string $sessionId, string $resultsAccessKey)
    {
        $this->sessionId = $sessionId;
        $this->resultsAccessKey = $resultsAccessKey;
    }

    /**
     * Gets the session ID
     * 
     * @return string
     */
    public function getSessionId(): string
    {
        return $this->sessionId;
    }

    /**
     * Sets the session ID
     * 
     * @param string $sessionId
     */
    public function setSessionId(string $sessionId): void
    {
        $this->sessionId = $sessionId;
    }

    /**
     * Gets the results access key
     * 
     * @return string
     */
    public function getResultsAccessKey(): string
    {
        return $this->resultsAccessKey;
    }

    /**
     * Sets the results access key
     * 
     * @param string $resultsAccessKey
     */
    public function setResultsAccessKey(string $resultsAccessKey): void
    {
        $this->resultsAccessKey = $resultsAccessKey;
    }

    /**
     * Validates the request
     * 
     * @throws ValidationException if validation fails
     */
    public function validate(): void
    {
        if (empty(trim($this->sessionId))) {
            throw new ValidationException('SessionId cannot be empty');
        }

        if (empty(trim($this->resultsAccessKey))) {
            throw new ValidationException('ResultsAccessKey cannot be empty');
        }

        if (!$this->isValidUuid($this->sessionId)) {
            throw new ValidationException('SessionId must be a valid UUID');
        }

        if (strlen($this->resultsAccessKey) < 10) {
            throw new ValidationException('ResultsAccessKey appears to be too short');
        }
    }

    /**
     * Checks if a string is a valid UUID
     * 
     * @param string $uuid
     * @return bool
     */
    private function isValidUuid(string $uuid): bool
    {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $uuid) === 1;
    }

    /**
     * Converts the request to an array
     * 
     * @return array
     */
    public function toArray(): array
    {
        return [
            'sessionId' => $this->sessionId,
            'resultsAccessKey' => $this->resultsAccessKey,
        ];
    }

    /**
     * Creates an instance from an array
     * 
     * @param array $data
     * @return self
     * @throws ValidationException if required fields are missing
     */
    public static function fromArray(array $data): self
    {
        if (!isset($data['sessionId'])) {
            throw new ValidationException('sessionId is required');
        }

        if (!isset($data['resultsAccessKey'])) {
            throw new ValidationException('resultsAccessKey is required');
        }

        return new self($data['sessionId'], $data['resultsAccessKey']);
    }

    /**
     * String representation (with redacted access key)
     * 
     * @return string
     */
    public function __toString(): string
    {
        return sprintf('ExchangeResultRequest{sessionId: %s, resultsAccessKey: [REDACTED]}', $this->sessionId);
    }
}