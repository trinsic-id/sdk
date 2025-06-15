package id.trinsic.serviceresults;

import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.GetSessionResultRequest;
import id.trinsic.api.models.GetSessionResultResponse;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Service for exchanging result access keys and retrieving session results
 */
public class ResultExchanger {
    
    private final SessionsApi sessionsApi;

    /**
     * Constructor
     * @param sessionsApi The Trinsic sessions API instance
     */
    public ResultExchanger(SessionsApi sessionsApi) {
        if (sessionsApi == null) {
            throw new IllegalArgumentException("sessionsApi cannot be null");
        }
        this.sessionsApi = sessionsApi;
    }

    /**
     * Exchange a result access key for the actual session results (synchronous)
     * @param request The exchange request containing session ID and access key
     * @return The session result response
     * @throws ValidationException if request validation fails
     * @throws RuntimeException if API call fails
     */
    public GetSessionResultResponse exchangeResult(ExchangeResultRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request cannot be null");
        }

        // Validate the request
        ResultProcessor.validateRequest(request);

        try {
            // Create the API request
            GetSessionResultRequest apiRequest = new GetSessionResultRequest();
            apiRequest.setResultsAccessKey(request.getResultsAccessKey());

            // Call the API
            return sessionsApi.getSessionResult(request.getSessionId(), apiRequest);
        } catch (Exception e) {
            throw new RuntimeException("Failed to exchange result: " + e.getMessage(), e);
        }
    }

    /**
     * Exchange a result access key for the actual session results (asynchronous)
     * @param request The exchange request containing session ID and access key
     * @return CompletableFuture containing the session result response
     */
    public CompletableFuture<GetSessionResultResponse> exchangeResultAsync(ExchangeResultRequest request) {
        return CompletableFuture.supplyAsync(() -> exchangeResult(request));
    }

    /**
     * Exchange a result access key and return the unwrapped result data (synchronous)
     * @param request The exchange request
     * @return The unwrapped session result data
     * @throws ValidationException if request validation fails
     * @throws RuntimeException if API call fails
     */
    public Object exchangeResultData(ExchangeResultRequest request) {
        GetSessionResultResponse response = exchangeResult(request);
        // Note: In the actual implementation, you would extract the data portion
        // This depends on the specific structure of GetSessionResultResponse
        return response;
    }

    /**
     * Exchange a result access key and return the unwrapped result data (asynchronous)
     * @param request The exchange request
     * @return CompletableFuture containing the unwrapped session result data
     */
    public CompletableFuture<Object> exchangeResultDataAsync(ExchangeResultRequest request) {
        return CompletableFuture.supplyAsync(() -> exchangeResultData(request));
    }
}