using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class Shared
{
    public static void MapSharedRoutes(this WebApplication app, ISessionsApi sessionApi, INetworkApi networkApi)
    {
        app.MapGet("/", context => Shared.ServeFile(context, "../../../ui-web/samples/dist/index.html"));
        app.MapGet("/error-popup", context => Shared.ServeFile(context, "../../../ui-web/samples/dist/error-popup.html"));
        app.MapGet("/redirect", context => Shared.ServeFile(context, "../../../ui-web/samples/dist/redirect.html"));

        app.MapGet("/providers", async context =>   
        {
            var ipAddress = context.Request.Query["ipAddress"].ToString();
            var response = await networkApi.RecommendProvidersAsync(new RecommendRequest()
            {
                RecommendationInfo = new RecommendationInfo()
                {
                    IpAddresses = [ipAddress],
                }
            });
            if (!response.IsOk)
            {
                throw new HttpRequestException(response.RawContent);
            }
            await context.Response.WriteAsJsonAsync(response.Ok());
        });

        app.MapPost("/exchange-result", async context =>
        {
            try
            {
                // Read and deserialize the request body
                var request = await context.Request.ReadFromJsonAsync<ExchangeResultRequest>();

                // Call the method to exchange the results key
                var response = await sessionApi.GetSessionResultAsync(request.SessionId, new GetSessionResultRequest(request.ResultsAccessKey));

                if (!response.IsOk)
                {
                    throw new HttpRequestException(response.RawContent);
                }
                // Return the result as JSON
                await context.Response.WriteAsJsonAsync(response.Ok());
            }
            catch (Exception e)
            {
                // Log the exception
                Console.Error.WriteLine(e);

                // Set the response status code to 500 Internal Server Error
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("An error occurred while processing your request.");
            }
        });
    }
    public static async Task ServeFile(HttpContext context, string file)
    {
        var htmlContent = await File.ReadAllTextAsync(file);
        context.Response.ContentType = "text/html";
        await context.Response.WriteAsync(htmlContent);
    }
}