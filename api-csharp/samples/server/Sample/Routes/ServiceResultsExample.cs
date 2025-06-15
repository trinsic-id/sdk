using System.ComponentModel.DataAnnotations;
using ServiceResults;
using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample.Routes;

/// <summary>
/// Example routes showing how to integrate ServiceResults
/// </summary>
public static class ServiceResultsExample
{
    /// <summary>
    /// Maps example routes that demonstrate ServiceResults usage
    /// </summary>
    public static void MapServiceResultsExampleRoutes(this WebApplication app, ISessionsApi sessionApi)
    {
        // Create a ResultExchanger instance
        var resultExchanger = new ResultExchanger(sessionApi);

        // Example route using ServiceResults with enhanced error handling
        app.MapPost("/exchange-result-enhanced", async (HttpContext context) =>
        {
            try
            {
                // Read and deserialize the request body using ServiceResults model
                var request = await context.Request.ReadFromJsonAsync<ServiceResults.ExchangeResultRequest>();
                
                if (request == null)
                {
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsJsonAsync(new { error = "Request body is required" });
                    return;
                }

                // Use ResultExchanger to handle the exchange with built-in validation
                var result = await resultExchanger.ExchangeResultDataAsync(request);
                
                // Process the result for additional insights
                var processedResult = ResultProcessor.ProcessSessionResult(result);
                
                // Return both the original result and processed insights
                await context.Response.WriteAsJsonAsync(new 
                { 
                    result = result,
                    insights = processedResult
                });
            }
            catch (ValidationException ex)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                app.Logger.LogError(ex, "Failed to exchange result");
                context.Response.StatusCode = 500;
                await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
            }
        });

        // Example route for batch processing multiple results
        app.MapPost("/exchange-multiple-results", async (HttpContext context) =>
        {
            try
            {
                var requests = await context.Request.ReadFromJsonAsync<ServiceResults.ExchangeResultRequest[]>();
                
                if (requests == null || requests.Length == 0)
                {
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsJsonAsync(new { error = "Request array is required and cannot be empty" });
                    return;
                }

                var results = new List<object>();
                var errors = new List<string?>();

                foreach (var request in requests)
                {
                    try
                    {
                        var result = await resultExchanger.ExchangeResultDataAsync(request);
                        results.Add(result);
                        errors.Add(null);
                    }
                    catch (Exception ex)
                    {
                        results.Add(null);
                        errors.Add(ex.Message);
                    }
                }

                await context.Response.WriteAsJsonAsync(new 
                { 
                    results = results,
                    errors = errors
                });
            }
            catch (Exception ex)
            {
                app.Logger.LogError(ex, "Failed to exchange multiple results");
                context.Response.StatusCode = 500;
                await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
            }
        });

        // Example route showing result validation without exchange
        app.MapPost("/validate-result-request", async (HttpContext context) =>
        {
            try
            {
                var request = await context.Request.ReadFromJsonAsync<ServiceResults.ExchangeResultRequest>();
                
                if (request == null)
                {
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsJsonAsync(new { error = "Request body is required" });
                    return;
                }

                // Just validate the request without exchanging
                ResultProcessor.ValidateRequest(request);
                
                await context.Response.WriteAsJsonAsync(new 
                { 
                    valid = true,
                    message = "Request is valid"
                });
            }
            catch (ValidationException ex)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new 
                { 
                    valid = false,
                    error = ex.Message 
                });
            }
            catch (Exception ex)
            {
                app.Logger.LogError(ex, "Failed to validate request");
                context.Response.StatusCode = 500;
                await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
            }
        });
    }
}