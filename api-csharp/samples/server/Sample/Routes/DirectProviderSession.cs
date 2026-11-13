using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample.Routes;

public static class DirectProviderSession
{
    public static void MapDirectProviderSessionRoutes(this WebApplication app)
    {
        app.MapPost("/refresh-content/{sessionId}", async (HttpContext context, string sessionId, ISessionsApi sessionApi) =>
        {
            var request = await context.Request.ReadFromJsonAsync<ResultsAccessKeyBody>()
                ?? throw new BadHttpRequestException("A request body is required.");
            var response = await sessionApi.RefreshStepContentAsync(Guid.Parse(sessionId),
                new RefreshStepContentRequest { ResultsAccessKey = request.ResultsAccessKey }, cancellationToken: context.RequestAborted);
            return SdkJson.Result(response);
        });

        app.MapPost("/create-direct-session/{providerId}", async (HttpContext context, string providerId, ISessionsApi sessionApi) =>
        {
            var fallbackToTrinsicUI = bool.Parse(context.Request.Query["fallbackToTrinsicUI"].ToString());
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();
            var capabilities = context.Request.Query["capabilities"].SelectMany(x => (x ?? "").Split(','))
                .Select(x => (IntegrationCapability)Enum.Parse(typeof(IntegrationCapability), x)).ToList();

            var request =
                new CreateDirectProviderSessionRequest
                {
                    Capabilities = capabilities,
                    EnableRedirectBackwardsCompatibility = false,
                    Provider = providerId,
                    VerificationProfileId = EnvironmentHelper.GetVerificationProfileIdOrThrow(),
                    FallbackToHostedUI = fallbackToTrinsicUI,
                    RedirectUrl = redirectUrl
                };
            var response = await sessionApi.CreateDirectProviderSessionAsync(request, cancellationToken: context.RequestAborted);

            return SdkJson.Result(response);
        });

        app.MapPost("/poll-results/{sessionId}", async (HttpContext context, string sessionId, ISessionsApi sessionApi) =>
        {
            var request = await context.Request.ReadFromJsonAsync<ResultsAccessKeyBody>()
                ?? throw new BadHttpRequestException("A request body is required.");
            var resultRequest = new GetSessionResultRequest { ResultsAccessKey = request.ResultsAccessKey };
            if (request.RedirectToken is not null)
                resultRequest.RedirectToken = request.RedirectToken;
            var response =
                await sessionApi.GetSessionResultAsync(Guid.Parse(sessionId), resultRequest,
                    cancellationToken: context.RequestAborted);
            return SdkJson.Result(response);
        });
    }
}
