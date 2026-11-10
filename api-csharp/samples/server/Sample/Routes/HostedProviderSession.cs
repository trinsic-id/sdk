using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class HostedProviderSession
{
    public static void MapHostedProviderSessionRoutes(this WebApplication app)
    {
        app.MapPost("/create-hosted-session/{providerId}", async (HttpContext context, string providerId, ISessionsApi sessionApi) =>
        {
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();

            var request = new CreateHostedProviderSessionRequest
            {
                EnableRedirectBackwardsCompatibility = false,
                Provider = providerId,
                RedirectUrl = redirectUrl,
                VerificationProfileId = EnvironmentHelper.GetVerificationProfileIdOrThrow()
            };

            var response = await sessionApi.CreateHostedProviderSessionAsync(request, cancellationToken: context.RequestAborted);

            return SdkJson.Result(response);
        });
    }
}
