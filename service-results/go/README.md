# ServiceResults Go Implementation

This directory contains the Go implementation of the ServiceResults project for use with the Trinsic Go SDK.

## Files

- `exchange_result_request.go` - Standard request model with validation
- `result_exchanger.go` - Service for exchanging result access keys  
- `result_processor.go` - Utility for processing and validating results
- `go.mod` - Go module definition

## Usage

### Basic Integration

1. Copy these files to your Go project
2. Import the package: `import "github.com/your-org/serviceresults"`
3. Replace direct API calls with ServiceResults utilities

### Example Usage

```go
package main

import (
    "context"
    "encoding/json"
    "net/http"
    "github.com/your-org/serviceresults"
)

func main() {
    // Initialize with your sessions API
    var sessionsAPI serviceresults.SessionsAPI // Your implementation
    exchanger := serviceresults.NewResultExchanger(sessionsAPI)
    processor := serviceresults.NewResultProcessor()

    http.HandleFunc("/exchange-result", func(w http.ResponseWriter, r *http.Request) {
        var request serviceresults.ExchangeResultRequest
        
        if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
            http.Error(w, "Invalid request", http.StatusBadRequest)
            return
        }

        result, err := exchanger.ExchangeResult(context.Background(), &request)
        if err != nil {
            if validationErr, ok := err.(*serviceresults.ValidationError); ok {
                http.Error(w, validationErr.Error(), http.StatusBadRequest)
            } else {
                http.Error(w, "Internal server error", http.StatusInternalServerError)
            }
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(result)
    })
}
```

### Dependencies

This implementation requires:
- Go 1.21 or later
- Your Trinsic Go SDK implementation

### Features

- **Request Validation**: Built-in validation with meaningful error messages
- **Context Support**: Full context support for cancellation and timeouts
- **Concurrent Processing**: Support for processing multiple requests concurrently
- **Error Handling**: Structured error types with proper error wrapping
- **Logging Support**: Built-in request sanitization for secure logging

### Testing

Example unit test:

```go
func TestValidateRequest_WithValidData_ShouldNotError(t *testing.T) {
    request := serviceresults.NewExchangeResultRequest(
        "550e8400-e29b-41d4-a716-446655440000",
        "rak_test123456",
    )
    
    err := request.Validate()
    assert.NoError(t, err)
}

func TestValidateRequest_WithInvalidUUID_ShouldError(t *testing.T) {
    request := serviceresults.NewExchangeResultRequest(
        "invalid-uuid",
        "rak_test123456",
    )
    
    err := request.Validate()
    assert.Error(t, err)
    assert.Contains(t, err.Error(), "valid UUID")
}
```

### Integration Example

For updating existing Go samples:

```go
// Before (direct API call)
func exchangeResult(w http.ResponseWriter, r *http.Request) {
    var body map[string]string
    json.NewDecoder(r.Body).Decode(&body)
    
    result, err := sessionsAPI.GetSessionResult(ctx, body["sessionId"], &GetSessionResultRequest{
        ResultsAccessKey: body["resultsAccessKey"],
    })
    // ... handle response
}

// After (using ServiceResults)
func exchangeResult(w http.ResponseWriter, r *http.Request) {
    var request serviceresults.ExchangeResultRequest
    json.NewDecoder(r.Body).Decode(&request)
    
    result, err := exchanger.ExchangeResult(ctx, &request)
    // ... handle response with built-in validation
}
```