# ServiceResults PHP Implementation

This directory contains the PHP implementation of the ServiceResults project for use with the Trinsic PHP SDK.

## Files

- `ExchangeResultRequest.php` - Standard request model with validation
- `ResultExchanger.php` - Service class for exchanging result access keys  
- `ResultProcessor.php` - Utility class for processing and validating results
- `ValidationException.php` - Custom exception for validation errors
- `composer.json` - Composer package configuration

## Requirements

- PHP 8.0 or higher
- Trinsic PHP SDK

## Installation

### Via Composer

```bash
composer require trinsic/service-results
```

### Manual Installation

1. Copy these files to your PHP project
2. Include the autoloader or manually require the files
3. Replace direct API calls with ServiceResults utilities

## Usage

### Basic Integration

```php
<?php

use Trinsic\ServiceResults\ExchangeResultRequest;
use Trinsic\ServiceResults\ResultExchanger;
use Trinsic\ServiceResults\ResultProcessor;
use Trinsic\ServiceResults\ValidationException;

// Initialize with your sessions API
$sessionsApi = new YourSessionsApiImplementation();
$exchanger = new ResultExchanger($sessionsApi);

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $request = ExchangeResultRequest::fromArray($input);
        
        $result = $exchanger->exchangeResult($request);
        
        header('Content-Type: application/json');
        echo json_encode($result);
    } catch (ValidationException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error']);
    }
}
```

### Framework Integration Examples

#### Laravel

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Trinsic\ServiceResults\ExchangeResultRequest;
use Trinsic\ServiceResults\ResultExchanger;
use Trinsic\ServiceResults\ValidationException;

class ResultController extends Controller
{
    private ResultExchanger $exchanger;

    public function __construct(ResultExchanger $exchanger)
    {
        $this->exchanger = $exchanger;
    }

    public function exchangeResult(Request $request)
    {
        try {
            $exchangeRequest = ExchangeResultRequest::fromArray($request->all());
            $result = $this->exchanger->exchangeResult($exchangeRequest);
            
            return response()->json($result);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
```

#### Symfony

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Trinsic\ServiceResults\ExchangeResultRequest;
use Trinsic\ServiceResults\ResultExchanger;
use Trinsic\ServiceResults\ValidationException;

class ResultController extends AbstractController
{
    private ResultExchanger $exchanger;

    public function __construct(ResultExchanger $exchanger)
    {
        $this->exchanger = $exchanger;
    }

    public function exchangeResult(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $exchangeRequest = ExchangeResultRequest::fromArray($data);
            $result = $this->exchanger->exchangeResult($exchangeRequest);
            
            return new JsonResponse($result);
        } catch (ValidationException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Internal server error'], 500);
        }
    }
}
```

### Features

- **Request Validation**: Built-in validation with meaningful error messages
- **Error Handling**: Custom exception types for different error scenarios
- **Result Processing**: Utility methods for common result operations
- **Retry Logic**: Built-in retry support for transient failures
- **Batch Operations**: Support for processing multiple requests
- **PSR-4 Autoloading**: Standard PHP autoloading support

### Testing

Example PHPUnit test:

```php
<?php

use PHPUnit\Framework\TestCase;
use Trinsic\ServiceResults\ExchangeResultRequest;
use Trinsic\ServiceResults\ValidationException;

class ExchangeResultRequestTest extends TestCase
{
    public function testValidateWithValidData(): void
    {
        $request = new ExchangeResultRequest(
            '550e8400-e29b-41d4-a716-446655440000',
            'rak_test123456'
        );
        
        $this->expectNotToPerformAssertions();
        $request->validate();
    }

    public function testValidateWithInvalidUuid(): void
    {
        $request = new ExchangeResultRequest(
            'invalid-uuid',
            'rak_test123456'
        );
        
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('SessionId must be a valid UUID');
        $request->validate();
    }
}
```

### Development

```bash
# Install dependencies
composer install

# Run tests
composer test

# Run static analysis
composer psalm
```