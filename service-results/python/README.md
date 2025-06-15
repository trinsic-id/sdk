# ServiceResults Python Implementation

This directory contains the Python implementation of the ServiceResults project for use with the Trinsic Python SDK.

## Files

- `exchange_result_request.py` - Standard request model with validation
- `result_exchanger.py` - Service class for exchanging result access keys  
- `result_processor.py` - Utility class for processing and validating results
- `__init__.py` - Package initialization and exports
- `pyproject.toml` - Modern Python packaging configuration

## Requirements

- Python 3.8 or higher
- Trinsic Python SDK

## Installation

### Via pip

```bash
pip install trinsic-service-results
```

### From source

```bash
git clone https://github.com/trinsic-id/sdk.git
cd sdk/service-results/python
pip install .
```

### Development installation

```bash
pip install -e ".[dev]"
```

## Usage

### Basic Integration

```python
from trinsic_service_results import (
    ExchangeResultRequest, 
    ResultExchanger, 
    ResultProcessor,
    ValidationError
)

# Initialize with your sessions API
sessions_api = YourSessionsApiImplementation()
exchanger = ResultExchanger(sessions_api)

# Handle request
try:
    request = ExchangeResultRequest.from_dict({
        "sessionId": "550e8400-e29b-41d4-a716-446655440000",
        "resultsAccessKey": "rak_test123456"
    })
    
    result = exchanger.exchange_result(request)
    print("Exchange successful:", result)
    
except ValidationError as e:
    print("Validation error:", e)
except Exception as e:
    print("Exchange failed:", e)
```

### Framework Integration Examples

#### FastAPI

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from trinsic_service_results import ExchangeResultRequest, ResultExchanger, ValidationError

app = FastAPI()
exchanger = ResultExchanger(sessions_api)

class ExchangeRequest(BaseModel):
    sessionId: str
    resultsAccessKey: str

@app.post("/exchange-result")
async def exchange_result(request: ExchangeRequest):
    try:
        exchange_request = ExchangeResultRequest.from_dict(request.dict())
        result = await exchanger.exchange_result_async(exchange_request)
        return result
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
```

#### Flask

```python
from flask import Flask, request, jsonify
from trinsic_service_results import ExchangeResultRequest, ResultExchanger, ValidationError

app = Flask(__name__)
exchanger = ResultExchanger(sessions_api)

@app.route('/exchange-result', methods=['POST'])
def exchange_result():
    try:
        exchange_request = ExchangeResultRequest.from_dict(request.json)
        result = exchanger.exchange_result(exchange_request)
        return jsonify(result)
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
```

#### Django

```python
from django.http import JsonResponse
from django.views import View
import json
from trinsic_service_results import ExchangeResultRequest, ResultExchanger, ValidationError

class ExchangeResultView(View):
    def __init__(self):
        self.exchanger = ResultExchanger(sessions_api)
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            exchange_request = ExchangeResultRequest.from_dict(data)
            result = self.exchanger.exchange_result(exchange_request)
            return JsonResponse(result, safe=False)
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error"}, status=500)
```

### Async Usage

```python
import asyncio
from trinsic_service_results import ExchangeResultRequest, ResultExchanger

async def exchange_multiple_results():
    requests = [
        ExchangeResultRequest("session1", "key1"),
        ExchangeResultRequest("session2", "key2"),
        ExchangeResultRequest("session3", "key3"),
    ]
    
    results, errors = await exchanger.exchange_multiple_results_async(requests)
    
    for i, (result, error) in enumerate(zip(results, errors)):
        if error:
            print(f"Request {i} failed: {error}")
        else:
            print(f"Request {i} succeeded: {result}")

# Run async example
asyncio.run(exchange_multiple_results())
```

### Features

- **Type Safety**: Full type hints and mypy support
- **Async Support**: Native async/await support with asyncio
- **Request Validation**: Built-in validation with meaningful error messages
- **Error Handling**: Custom exception types for different error scenarios
- **Result Processing**: Utility methods for common result operations
- **Batch Operations**: Support for processing multiple requests concurrently
- **Dataclasses**: Modern Python dataclasses for clean data models

### Testing

Example pytest test:

```python
import pytest
from trinsic_service_results import ExchangeResultRequest, ValidationError

def test_validate_request_with_valid_data():
    request = ExchangeResultRequest(
        session_id="550e8400-e29b-41d4-a716-446655440000",
        results_access_key="rak_test123456"
    )
    # Should not raise any exception
    request.validate()

def test_validate_request_with_invalid_uuid():
    with pytest.raises(ValueError, match="session_id must be a valid UUID"):
        ExchangeResultRequest(
            session_id="invalid-uuid",
            results_access_key="rak_test123456"
        )

@pytest.mark.asyncio
async def test_exchange_result_async():
    # Mock sessions API
    class MockSessionsApi:
        async def get_session_result_async(self, session_id, request):
            return {"mock": "result"}
    
    exchanger = ResultExchanger(MockSessionsApi())
    request = ExchangeResultRequest("550e8400-e29b-41d4-a716-446655440000", "rak_test")
    
    result = await exchanger.exchange_result_async(request)
    assert result == {"mock": "result"}
```

### Development

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Format code
black .
isort .

# Type checking
mypy .

# Linting
flake8 .
```