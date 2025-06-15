package serviceresults

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
)

// ExchangeResultRequest represents a standard request for exchanging session result access keys
type ExchangeResultRequest struct {
	// SessionID is the unique identifier for the verification session
	SessionID string `json:"sessionId" validate:"required"`
	// ResultsAccessKey is the access key needed to retrieve session results
	ResultsAccessKey string `json:"resultsAccessKey" validate:"required"`
}

// NewExchangeResultRequest creates a new ExchangeResultRequest with the given parameters
func NewExchangeResultRequest(sessionID, resultsAccessKey string) *ExchangeResultRequest {
	return &ExchangeResultRequest{
		SessionID:        sessionID,
		ResultsAccessKey: resultsAccessKey,
	}
}

// Validate checks if the ExchangeResultRequest is valid
func (r *ExchangeResultRequest) Validate() error {
	if r == nil {
		return errors.New("request cannot be nil")
	}

	if strings.TrimSpace(r.SessionID) == "" {
		return errors.New("sessionId cannot be empty")
	}

	if strings.TrimSpace(r.ResultsAccessKey) == "" {
		return errors.New("resultsAccessKey cannot be empty")
	}

	if !isValidUUID(r.SessionID) {
		return errors.New("sessionId must be a valid UUID")
	}

	if len(r.ResultsAccessKey) < 10 {
		return errors.New("resultsAccessKey appears to be too short")
	}

	return nil
}

// isValidUUID checks if a string is a valid UUID
func isValidUUID(str string) bool {
	uuidRegex := regexp.MustCompile(`^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`)
	return uuidRegex.MatchString(strings.ToLower(str))
}

// String returns a string representation of the request (with redacted access key)
func (r *ExchangeResultRequest) String() string {
	return fmt.Sprintf("ExchangeResultRequest{SessionID: %s, ResultsAccessKey: [REDACTED]}", r.SessionID)
}