package serviceresults

import (
	"fmt"
	"time"
)

// ValidationError represents a validation error
type ValidationError struct {
	Message string
}

func (e *ValidationError) Error() string {
	return e.Message
}

// NewValidationError creates a new validation error
func NewValidationError(message string) *ValidationError {
	return &ValidationError{Message: message}
}

// ProcessedResult represents processed session result information
type ProcessedResult struct {
	SessionID        string     `json:"sessionId,omitempty"`
	State            string     `json:"state,omitempty"`
	FailCode         string     `json:"failCode,omitempty"`
	FailReason       string     `json:"failReason,omitempty"`
	ResultCount      int        `json:"resultCount"`
	HasVerifications bool       `json:"hasVerifications"`
	CompletedAt      *time.Time `json:"completedAt,omitempty"`
	ProcessedAt      time.Time  `json:"processedAt"`
}

// ResultProcessor provides utility methods for processing and validating session results
type ResultProcessor struct{}

// NewResultProcessor creates a new ResultProcessor instance
func NewResultProcessor() *ResultProcessor {
	return &ResultProcessor{}
}

// ValidateRequest validates an ExchangeResultRequest
func (rp *ResultProcessor) ValidateRequest(request *ExchangeResultRequest) error {
	if request == nil {
		return NewValidationError("request cannot be nil")
	}

	return request.Validate()
}

// ValidateMultipleRequests validates multiple ExchangeResultRequest instances
func (rp *ResultProcessor) ValidateMultipleRequests(requests []*ExchangeResultRequest) (valid []*ExchangeResultRequest, invalid []RequestValidationError) {
	for i, request := range requests {
		if err := rp.ValidateRequest(request); err != nil {
			invalid = append(invalid, RequestValidationError{
				Index:   i,
				Request: request,
				Error:   err.Error(),
			})
		} else {
			valid = append(valid, request)
		}
	}
	return
}

// RequestValidationError represents a validation error for a specific request
type RequestValidationError struct {
	Index   int                     `json:"index"`
	Request *ExchangeResultRequest  `json:"request"`
	Error   string                  `json:"error"`
}

// ProcessSessionResult processes a session result and extracts common information
func (rp *ResultProcessor) ProcessSessionResult(result interface{}) (*ProcessedResult, error) {
	if result == nil {
		return nil, fmt.Errorf("result cannot be nil")
	}

	// Create a basic processed result
	processed := &ProcessedResult{
		ProcessedAt:      time.Now(),
		HasVerifications: false,
		ResultCount:      0,
	}

	// In a real implementation, you would extract fields from the result
	// based on the actual structure of your session result
	// This is a simplified version that would need to be customized
	// based on the specific structure of the GetSessionResult response

	return processed, nil
}

// SanitizeRequestForLogging removes sensitive information from a request for logging
func (rp *ResultProcessor) SanitizeRequestForLogging(request *ExchangeResultRequest) map[string]interface{} {
	if request == nil {
		return nil
	}

	return map[string]interface{}{
		"sessionId":        request.SessionID,
		"resultsAccessKey": "[REDACTED]",
	}
}

// SanitizeMultipleRequestsForLogging sanitizes multiple requests for logging
func (rp *ResultProcessor) SanitizeMultipleRequestsForLogging(requests []*ExchangeResultRequest) []map[string]interface{} {
	sanitized := make([]map[string]interface{}, len(requests))
	for i, request := range requests {
		sanitized[i] = rp.SanitizeRequestForLogging(request)
	}
	return sanitized
}