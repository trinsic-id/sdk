using Trinsic.Api.Client;

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

        if (exception is ApiException apiException)
        {
            logger.LogError("Trinsic API returned {StatusCode}: {Body}", apiException.ErrorCode, apiException.ErrorContent);
        }

        context.Response.StatusCode = exception switch
        {
            ApiException api when api.ErrorCode is >= 400 and <= 599 => api.ErrorCode,
            BadHttpRequestException badRequest => badRequest.StatusCode,
            _ => StatusCodes.Status500InternalServerError
        };

        await context.Response.WriteAsJsonAsync(new
        {
            message = "Request failed: check the logs on the backend for more information."
        });
    }
}
