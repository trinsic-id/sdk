package serviceresults

import (
	"context"
	"errors"
	"fmt"
	"time"
)

// SessionsAPI defines the interface for the Trinsic sessions API
type SessionsAPI interface {
	GetSessionResult(ctx context.Context, sessionID string, request interface{}) (interface{}, error)
}

// ResultExchanger provides methods for exchanging result access keys
type ResultExchanger struct {
	sessionsAPI SessionsAPI
}

// NewResultExchanger creates a new ResultExchanger instance
func NewResultExchanger(sessionsAPI SessionsAPI) *ResultExchanger {
	if sessionsAPI == nil {
		panic("sessionsAPI cannot be nil")
	}
	return &ResultExchanger{
		sessionsAPI: sessionsAPI,
	}
}

// GetSessionResultRequest represents the API request structure
type GetSessionResultRequest struct {
	ResultsAccessKey string `json:"resultsAccessKey"`
}

// ExchangeResult exchanges a result access key for the actual session results
func (re *ResultExchanger) ExchangeResult(ctx context.Context, request *ExchangeResultRequest) (interface{}, error) {
	if request == nil {
		return nil, errors.New("request cannot be nil")
	}

	// Validate the request
	if err := request.Validate(); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// Create the API request
	apiRequest := &GetSessionResultRequest{
		ResultsAccessKey: request.ResultsAccessKey,
	}

	// Call the API
	result, err := re.sessionsAPI.GetSessionResult(ctx, request.SessionID, apiRequest)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange result: %w", err)
	}

	return result, nil
}

// ExchangeResultWithTimeout exchanges a result with a timeout context
func (re *ResultExchanger) ExchangeResultWithTimeout(request *ExchangeResultRequest, timeout time.Duration) (interface{}, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	return re.ExchangeResult(ctx, request)
}

// ExchangeMultipleResults exchanges multiple result access keys concurrently
func (re *ResultExchanger) ExchangeMultipleResults(ctx context.Context, requests []*ExchangeResultRequest) ([]interface{}, []error) {
	if len(requests) == 0 {
		return nil, nil
	}

	results := make([]interface{}, len(requests))
	errors := make([]error, len(requests))

	// Use channels for concurrent processing
	type resultPair struct {
		index  int
		result interface{}
		err    error
	}

	resultChan := make(chan resultPair, len(requests))

	// Start goroutines for each request
	for i, req := range requests {
		go func(idx int, request *ExchangeResultRequest) {
			result, err := re.ExchangeResult(ctx, request)
			resultChan <- resultPair{index: idx, result: result, err: err}
		}(i, req)
	}

	// Collect results
	for i := 0; i < len(requests); i++ {
		pair := <-resultChan
		results[pair.index] = pair.result
		errors[pair.index] = pair.err
	}

	return results, errors
}