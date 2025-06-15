# ServiceResults Java Implementation

This directory contains the Java implementation of the ServiceResults project for use with the Trinsic Java SDK.

## Files

- `ExchangeResultRequest.java` - Standard request model with validation annotations
- `ResultExchanger.java` - Service class for exchanging result access keys  
- `ResultProcessor.java` - Utility class for processing and validating results

## Usage

### Basic Integration

1. Copy these files to your Java project under the `id.trinsic.serviceresults` package
2. Add the package import: `import id.trinsic.serviceresults.*;`
3. Replace direct API calls with ServiceResults utilities

### Example Usage

```java
// In your Javalin application
public class Advanced {
    public static void AdvancedRoutes(Javalin app, SessionsApi session) {
        ResultExchanger exchanger = new ResultExchanger(session);
        
        app.post("/exchange-result", ctx -> {
            try {
                var request = ctx.bodyAsClass(ExchangeResultRequest.class);
                var result = exchanger.exchangeResult(request);
                ctx.json(result);
            } catch (ResultProcessor.ValidationException ex) {
                ctx.status(400).result(ex.getMessage());
            } catch (Exception ex) {
                ctx.status(500).result("Internal server error: " + ex.getMessage());
            }
        });
    }
}
```

### Dependencies

This implementation requires:
- `jakarta.validation:jakarta.validation-api` for validation annotations
- `org.hibernate.validator:hibernate-validator` for validation implementation  
- `id.trinsic:api` Java SDK package

Add to your `pom.xml`:
```xml
<dependency>
    <groupId>jakarta.validation</groupId>
    <artifactId>jakarta.validation-api</artifactId>
    <version>3.0.2</version>
</dependency>
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>8.0.1.Final</version>
</dependency>
```

### Features

- **Request Validation**: Automatic validation using Jakarta Bean Validation
- **Error Handling**: Consistent error handling with meaningful messages  
- **Async Support**: Both synchronous and asynchronous operation modes
- **Result Processing**: Utility methods for common result operations
- **Type Safety**: Full Java type safety and IDE support

### Testing

Example unit test with JUnit 5:

```java
@Test
void validateRequest_withValidData_shouldNotThrow() {
    ExchangeResultRequest request = new ExchangeResultRequest(
        "550e8400-e29b-41d4-a716-446655440000", 
        "rak_test123"
    );
    
    assertDoesNotThrow(() -> ResultProcessor.validateRequest(request));
}

@Test
void validateRequest_withInvalidGuid_shouldThrow() {
    ExchangeResultRequest request = new ExchangeResultRequest(
        "invalid-guid", 
        "rak_test123"
    );
    
    assertThrows(ResultProcessor.ValidationException.class, 
        () -> ResultProcessor.validateRequest(request));
}
```