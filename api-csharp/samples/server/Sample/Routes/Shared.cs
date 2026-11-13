using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample.Routes;

public static class Shared
{
    public static void MapSharedRoutes(this WebApplication app)
    {
        app.MapGet("/providers", async (HttpContext context, ISessionsApi sessionApi) =>
        {
            List<string> ipAddresses = context.Request.Query["ipAddress"] == StringValues.Empty ? [] : [context.Request.Query["ipAddress"].ToString()];
            var response = await sessionApi.RecommendProvidersAsync(new RecommendProvidersRequest
            {
                VerificationProfileId = EnvironmentHelper.GetVerificationProfileIdOrThrow(),
                RecommendationInfo = new RecommendationInfo
                {
                    IpAddresses = ipAddresses,
                }
            }, cancellationToken: context.RequestAborted);
            return SdkJson.Result(response);
        });

        app.MapGet("/exchange-result", async (Guid sessionId, string? redirectToken, HttpContext context, ISessionsApi sessionApi, [FromServices]IPersistence persistence) =>
        {
            var resultRequest = new GetSessionResultRequest
            {
                ResultsAccessKey = await persistence.GetResultsAccessKey(sessionId)
            };
            
            if (redirectToken is not null)
            {
                resultRequest.RedirectToken = redirectToken;
            }
            
            var response = await sessionApi.GetSessionResultAsync(sessionId, resultRequest,
                cancellationToken: context.RequestAborted);

            return response.Session.Success 
                ? Results.Redirect($"{Environment.GetEnvironmentVariable("OWN_FRONTEND_BASE_URL")}/exchange-result-success")
                : Results.Redirect($"{Environment.GetEnvironmentVariable("OWN_FRONTEND_BASE_URL")}/exchange-result-failure");
        });
    }
}
