package id.trinsic.serviceresults;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

/**
 * Utility class for processing and validating session results
 */
public class ResultProcessor {
    
    private static final Validator validator;
    
    static {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    /**
     * Validates an ExchangeResultRequest
     * @param request The request to validate
     * @throws IllegalArgumentException if request is null
     * @throws ValidationException if validation fails
     */
    public static void validateRequest(ExchangeResultRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request cannot be null");
        }

        // Use bean validation
        Set<ConstraintViolation<ExchangeResultRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            StringBuilder sb = new StringBuilder("Request validation failed: ");
            for (ConstraintViolation<ExchangeResultRequest> violation : violations) {
                sb.append(violation.getMessage()).append("; ");
            }
            throw new ValidationException(sb.toString());
        }

        // Additional custom validations
        if (request.getSessionId() == null || request.getSessionId().trim().isEmpty()) {
            throw new ValidationException("SessionId cannot be null or empty");
        }

        if (request.getResultsAccessKey() == null || request.getResultsAccessKey().trim().isEmpty()) {
            throw new ValidationException("ResultsAccessKey cannot be null or empty");
        }

        // Validate SessionId format (should be a valid GUID)
        if (!request.isValidSessionId()) {
            throw new ValidationException("SessionId must be a valid UUID");
        }
    }

    /**
     * Processes a session result and extracts common information
     * @param result The session result to process (Object type for flexibility)
     * @return Processed result information
     */
    public static ProcessedResult processSessionResult(Object result) {
        if (result == null) {
            throw new IllegalArgumentException("result cannot be null");
        }

        // Note: This is a simplified implementation
        // In practice, you would extract actual fields from the result object
        // based on the specific structure of your session result
        
        ProcessedResult processed = new ProcessedResult();
        processed.setHasResult(true);
        processed.setProcessedAt(LocalDateTime.now());
        
        // TODO: Extract actual fields from result object
        // This would depend on the structure of GetSessionResult
        
        return processed;
    }

    /**
     * Custom validation exception
     */
    public static class ValidationException extends RuntimeException {
        public ValidationException(String message) {
            super(message);
        }
        
        public ValidationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}

/**
 * Represents processed session result information
 */
class ProcessedResult {
    private String sessionId;
    private String state;
    private String failCode;
    private String failReason;
    private int resultCount;
    private boolean hasResult;
    private LocalDateTime processedAt;

    // Getters and setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getFailCode() {
        return failCode;
    }

    public void setFailCode(String failCode) {
        this.failCode = failCode;
    }

    public String getFailReason() {
        return failReason;
    }

    public void setFailReason(String failReason) {
        this.failReason = failReason;
    }

    public int getResultCount() {
        return resultCount;
    }

    public void setResultCount(int resultCount) {
        this.resultCount = resultCount;
    }

    public boolean isHasResult() {
        return hasResult;
    }

    public void setHasResult(boolean hasResult) {
        this.hasResult = hasResult;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    @Override
    public String toString() {
        return "ProcessedResult{" +
                "sessionId='" + sessionId + '\'' +
                ", state='" + state + '\'' +
                ", failCode='" + failCode + '\'' +
                ", failReason='" + failReason + '\'' +
                ", resultCount=" + resultCount +
                ", hasResult=" + hasResult +
                ", processedAt=" + processedAt +
                '}';
    }
}