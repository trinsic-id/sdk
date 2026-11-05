using Microsoft.Extensions.Primitives;
using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class Shared
{
    public static void MapSharedRoutes(this WebApplication app)
    {
        app.MapGet("/providers", async (HttpContext context, ISessionsApi sessionApi) =>
        {
            List<string> ipAddresses = context.Request.Query["ipAddress"] == StringValues.Empty ? [] : [context.Request.Query["ipAddress"].ToString()];
            var response = await sessionApi.RecommendProvidersAsync(new RecommendProvidersRequest(verificationProfileId: EnvironmentHelper.GetVerificationProfileIdOrThrow())
            {
                RecommendationInfo = new RecommendationInfo
                {
                    IpAddresses = ipAddresses,
                }
            }, cancellationToken: context.RequestAborted);
            return SdkJson.Result(response);
        });

        app.MapPost("/exchange-result", async (HttpContext context, ISessionsApi sessionApi) =>
        {
            // Read and deserialize the request body
            var request = await context.Request.ReadFromJsonAsync<ExchangeResultRequest>()
                ?? throw new BadHttpRequestException("A request body is required.");

            // Call the method to exchange the results key
            var resultRequest = new GetSessionResultRequest(resultsAccessKey: request.ResultsAccessKey);
            if (request.RedirectToken is not null)
                resultRequest.RedirectToken = request.RedirectToken;
            var response = await sessionApi.GetSessionResultAsync(Guid.Parse(request.SessionId), resultRequest,
                cancellationToken: context.RequestAborted);
            
            // Return the result as JSON
            return SdkJson.Result(response);
        });
    }
}
