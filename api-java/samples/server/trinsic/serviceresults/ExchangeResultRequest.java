package id.trinsic.serviceresults;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/**
 * Standard request model for exchanging session result access keys
 */
public class ExchangeResultRequest {
    
    /**
     * The unique identifier for the verification session
     */
    @NotNull(message = "SessionId cannot be null")
    @NotBlank(message = "SessionId cannot be blank")
    private String sessionId;

    /**
     * The access key needed to retrieve session results
     */
    @NotNull(message = "ResultsAccessKey cannot be null")
    @NotBlank(message = "ResultsAccessKey cannot be blank")
    private String resultsAccessKey;

    /**
     * Default constructor
     */
    public ExchangeResultRequest() {}

    /**
     * Constructor with parameters
     * @param sessionId The session identifier
     * @param resultsAccessKey The results access key
     */
    public ExchangeResultRequest(String sessionId, String resultsAccessKey) {
        this.sessionId = sessionId;
        this.resultsAccessKey = resultsAccessKey;
    }

    /**
     * Gets the session ID
     * @return The session ID
     */
    public String getSessionId() {
        return sessionId;
    }

    /**
     * Sets the session ID
     * @param sessionId The session ID
     */
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    /**
     * Gets the results access key
     * @return The results access key
     */
    public String getResultsAccessKey() {
        return resultsAccessKey;
    }

    /**
     * Sets the results access key
     * @param resultsAccessKey The results access key
     */
    public void setResultsAccessKey(String resultsAccessKey) {
        this.resultsAccessKey = resultsAccessKey;
    }

    /**
     * Validates that the sessionId is a valid UUID
     * @return true if valid, false otherwise
     */
    public boolean isValidSessionId() {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            return false;
        }
        try {
            UUID.fromString(sessionId);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    @Override
    public String toString() {
        return "ExchangeResultRequest{" +
                "sessionId='" + sessionId + '\'' +
                ", resultsAccessKey='[REDACTED]'" +
                '}';
    }
}