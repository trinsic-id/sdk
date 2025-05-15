using System.Text.Json;

namespace Sample;

public class JsonExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<JsonExceptionMiddleware> _logger;

    public JsonExceptionMiddleware(RequestDelegate next, ILogger<JsonExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex, _logger);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception, ILogger logger)
    {
        logger.LogError(exception, "An unhandled exception occurred");

        // You could extract response text or other data from inner exceptions or custom exception types
        if (exception is HttpRequestException httpEx && httpEx.Data["Body"] is string responseBody)
        {
            logger.LogError("Response body: {Body}", responseBody);
        }

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var result = JsonSerializer.Serialize(new
        {
            message = $"Request failed: check the logs on the backend for more information. {exception.Message}"
        });

        await context.Response.WriteAsync(result);
    }
}