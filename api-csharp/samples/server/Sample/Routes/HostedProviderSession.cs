using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class HostedProviderSession
{
    public static void MapHostedProviderSessionRoutes(this WebApplication app, ISessionsApi sessionApi)
    {
        app.MapPost("/create-hosted-session/{providerId}", async (HttpContext context, string providerId) =>
        {
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();

            var request = new CreateHostedProviderSessionRequest(providerId, redirectUrl, EnvironmentHelper.GetVerificationProfileIdOrThrow());

            var response = await sessionApi.CreateHostedProviderSessionAsync(request);
            response.LogAndThrowIfError(app.Logger);

            await context.Response.WriteAsJsonAsync(response.Ok());
        });
    }
}