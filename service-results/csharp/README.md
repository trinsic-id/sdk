# ServiceResults C# Implementation

This directory contains the C# implementation of the ServiceResults project for use with the Trinsic C# SDK.

## Files

- `ExchangeResultRequest.cs` - Standard request model with validation attributes
- `ResultExchanger.cs` - Service class for exchanging result access keys  
- `ResultProcessor.cs` - Utility class for processing and validating results

## Usage

### Basic Integration

1. Copy these files to your C# project
2. Add the namespace `using ServiceResults;`
3. Replace direct API calls with ServiceResults utilities

### Example Usage

```csharp
// In your startup/DI configuration
services.AddScoped<ResultExchanger>();

// In your controller/endpoint
app.MapPost("/exchange-result", async (
    ExchangeResultRequest request, 
    ResultExchanger exchanger) =>
{
    try 
    {
        var result = await exchanger.ExchangeResultDataAsync(request);
        return Results.Ok(result);
    }
    catch (ValidationException ex)
    {
        return Results.BadRequest(ex.Message);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});
```

### Dependencies

This implementation requires:
- `System.ComponentModel.DataAnnotations` (built-in)
- `Trinsic.Api` NuGet package

### Features

- **Request Validation**: Automatic validation using data annotations
- **Error Handling**: Consistent error handling with meaningful messages  
- **Result Processing**: Utility methods for common result operations
- **Type Safety**: Full C# type safety and IntelliSense support

### Testing

Example unit test:

```csharp
[Test]
public void ValidateRequest_WithValidData_ShouldNotThrow()
{
    var request = new ExchangeResultRequest("550e8400-e29b-41d4-a716-446655440000", "rak_test123");
    
    Assert.DoesNotThrow(() => ResultProcessor.ValidateRequest(request));
}

[Test]
public void ValidateRequest_WithInvalidGuid_ShouldThrow()
{
    var request = new ExchangeResultRequest("invalid-guid", "rak_test123");
    
    Assert.Throws<ValidationException>(() => ResultProcessor.ValidateRequest(request));
}
```