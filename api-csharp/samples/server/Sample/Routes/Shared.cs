using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Primitives;
using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class Shared
{
    public static void MapSharedRoutes(this WebApplication app, ISessionsApi sessionApi, INetworkApi networkApi)
    {
        app.MapGet("/providers", async context =>
        {
            List<string> ipAddresses = context.Request.Query["ipAddress"] == StringValues.Empty ? [] : [context.Request.Query["ipAddress"].ToString()];
            var response = await networkApi.RecommendProvidersAsync(new RecommendRequest
            {
                RecommendationInfo = new RecommendationInfo
                {
                    IpAddresses = ipAddresses,
                }
            });
            response.LogAndThrowIfError(app.Logger);
            await context.Response.WriteAsJsonAsync(response.Ok());
        });

        app.MapPost("/exchange-result", async context =>
        {
            // Read and deserialize the request body
            var request = await context.Request.ReadFromJsonAsync<ExchangeResultRequest>();

            // Call the method to exchange the results key
            var response = await sessionApi.GetSessionResultAsync(request.SessionId, new GetSessionResultRequest(request.ResultsAccessKey ));
            response.LogAndThrowIfError(app.Logger);
            
            // Return the result as JSON
            await context.Response.WriteAsJsonAsync(response.Ok());
        });
    }
}