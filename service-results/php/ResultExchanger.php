<?php

namespace Trinsic\ServiceResults;

/**
 * Interface for the Trinsic sessions API
 */
interface SessionsApiInterface
{
    /**
     * Gets session result from the API
     * 
     * @param string $sessionId
     * @param array $request
     * @return mixed
     */
    public function getSessionResult(string $sessionId, array $request);
}

/**
 * Service for exchanging result access keys and retrieving session results
 */
class ResultExchanger
{
    private SessionsApiInterface $sessionsApi;

    /**
     * Constructor
     * 
     * @param SessionsApiInterface $sessionsApi The Trinsic sessions API instance
     */
    public function __construct(SessionsApiInterface $sessionsApi)
    {
        $this->sessionsApi = $sessionsApi;
    }

    /**
     * Exchange a result access key for the actual session results
     * 
     * @param ExchangeResultRequest $request The exchange request
     * @return mixed The session result
     * @throws ValidationException if request validation fails
     * @throws \Exception if API call fails
     */
    public function exchangeResult(ExchangeResultRequest $request)
    {
        // Validate the request
        $request->validate();

        try {
            // Create the API request
            $apiRequest = [
                'resultsAccessKey' => $request->getResultsAccessKey(),
            ];

            // Call the API
            return $this->sessionsApi->getSessionResult($request->getSessionId(), $apiRequest);
        } catch (\Exception $e) {
            throw new \Exception('Failed to exchange result: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Exchange multiple results
     * 
     * @param ExchangeResultRequest[] $requests Array of exchange requests
     * @return array Array of results and errors
     */
    public function exchangeMultipleResults(array $requests): array
    {
        $results = [];
        $errors = [];

        foreach ($requests as $index => $request) {
            try {
                $results[$index] = $this->exchangeResult($request);
                $errors[$index] = null;
            } catch (\Exception $e) {
                $results[$index] = null;
                $errors[$index] = $e->getMessage();
            }
        }

        return [
            'results' => $results,
            'errors' => $errors,
        ];
    }

    /**
     * Exchange result with retry logic
     * 
     * @param ExchangeResultRequest $request
     * @param int $maxRetries
     * @param int $retryDelayMs
     * @return mixed
     * @throws \Exception
     */
    public function exchangeResultWithRetry(ExchangeResultRequest $request, int $maxRetries = 3, int $retryDelayMs = 1000)
    {
        $lastException = null;

        for ($attempt = 0; $attempt <= $maxRetries; $attempt++) {
            try {
                return $this->exchangeResult($request);
            } catch (ValidationException $e) {
                // Don't retry validation errors
                throw $e;
            } catch (\Exception $e) {
                $lastException = $e;
                
                if ($attempt < $maxRetries) {
                    usleep($retryDelayMs * 1000); // Convert to microseconds
                }
            }
        }

        throw new \Exception(
            sprintf('Failed to exchange result after %d attempts: %s', $maxRetries + 1, $lastException->getMessage()),
            0,
            $lastException
        );
    }
}