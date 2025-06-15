# ServiceResults TypeScript Implementation

This directory contains the TypeScript implementation of the ServiceResults project for use with the Trinsic TypeScript SDK.

## Files

- `ExchangeResultRequest.ts` - Type definitions and validation for the request model
- `ResultExchanger.ts` - Service class for exchanging result access keys  
- `ResultProcessor.ts` - Utility class for processing and validating results
- `index.ts` - Main exports for the module
- `package.json` - Package configuration
- `tsconfig.json` - TypeScript configuration

## Usage

### Basic Integration

1. Copy these files to your TypeScript project
2. Install dependencies: `npm install`
3. Import the classes: `import { ResultExchanger, ResultProcessor } from './service-results';`
4. Replace direct API calls with ServiceResults utilities

### Example Usage

```typescript
import { SessionsApi } from '@trinsic/api';
import { ResultExchanger, ResultProcessor, ExchangeResultRequest } from './service-results';
import express from 'express';

const app = express();
const sessionsApi = new SessionsApi(/* config */);
const exchanger = new ResultExchanger(sessionsApi);

app.post('/exchange-result', async (req, res) => {
  try {
    const request: ExchangeResultRequest = req.body;
    const result = await exchanger.exchangeResultData(request);
    res.json(result);
  } catch (error) {
    if (error instanceof ResultProcessor.ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
```

### Building

```bash
npm run build    # Compile TypeScript to JavaScript
npm run test     # Run tests
npm run lint     # Run linter
```

### Dependencies

This implementation requires:
- `@trinsic/api` - The Trinsic TypeScript SDK (peer dependency)
- `typescript` - TypeScript compiler (dev dependency)

### Features

- **Type Safety**: Full TypeScript type safety and IntelliSense support
- **Request Validation**: Runtime validation with meaningful error messages
- **Error Handling**: Custom error classes for different error types
- **Async Support**: Promise-based API with async/await support
- **Batch Operations**: Support for processing multiple requests
- **Logging Support**: Built-in request sanitization for secure logging

### Testing

Example unit test with Jest:

```typescript
import { ResultProcessor, ValidationError } from '../ResultProcessor';
import { createExchangeResultRequest } from '../ExchangeResultRequest';

describe('ResultProcessor', () => {
  test('validateRequest with valid data should not throw', () => {
    const request = createExchangeResultRequest(
      '550e8400-e29b-41d4-a716-446655440000',
      'rak_test123456'
    );
    
    expect(() => ResultProcessor.validateRequest(request)).not.toThrow();
  });

  test('validateRequest with invalid UUID should throw', () => {
    const request = createExchangeResultRequest(
      'invalid-uuid',
      'rak_test123456'
    );
    
    expect(() => ResultProcessor.validateRequest(request))
      .toThrow(ValidationError);
  });
});
```

### Integration Example

For updating existing TypeScript samples:

```typescript
// Before (in shared.ts)
app.post("/exchange-result", async (req: any, res: any) => {
  const result = await sessionsApi.getSessionResult(req.body.sessionId, {
    resultsAccessKey: req.body.resultsAccessKey,
  });
  res.send(result);
});

// After (using ServiceResults)
app.post("/exchange-result", async (req: any, res: any) => {
  try {
    const result = await exchanger.exchangeResultData(req.body);
    res.send(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Internal server error' });
    }
  }
});
```