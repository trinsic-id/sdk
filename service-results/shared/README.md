# ServiceResults Common Specification

This directory contains shared specifications and schemas that define the common interface for ServiceResults across all language implementations.

## Files

### exchange-result-request.schema.json
JSON Schema definition for the `ExchangeResultRequest` model that all language implementations should follow.

**Properties:**
- `sessionId` (string, required): UUID of the verification session
- `resultsAccessKey` (string, required): Access key for retrieving results

### Common Interface

All language implementations should provide these core components:

#### ExchangeResultRequest
A data class/model representing the request to exchange result access keys.

#### ResultExchanger  
A service class with methods:
- `exchangeResult(request: ExchangeResultRequest): Promise<SessionResult>`
- Error handling for invalid requests or API failures

#### ResultProcessor
A utility class with methods:
- `validateRequest(request: ExchangeResultRequest): boolean`
- `processResult(result: SessionResult): ProcessedResult`
- Common result transformations and validations

## Error Handling

All implementations should handle these error scenarios:
- Invalid or missing sessionId
- Invalid or missing resultsAccessKey  
- API connection failures
- Result not found errors
- Permission denied errors

## Testing

Each implementation should include tests for:
- Valid result exchange requests
- Invalid request handling
- Error scenarios
- Result processing utilities