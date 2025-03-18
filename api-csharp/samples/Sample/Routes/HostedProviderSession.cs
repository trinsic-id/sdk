using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class HostedProviderSession
{
    public static void MapHostedProviderSessionRoutes(this WebApplication app, SessionsApi sessionApi)
    {
        app.MapGet("/hosted", context => Shared.ServeFile(context, "../../../ui-web/samples/dist/hosted.html"));
        app.MapGet("/hosted-launch/{providerId}", async (HttpContext context, string providerId) =>
        {
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();

            var request = new CreateHostedProviderSessionRequest(providerId, null, redirectUrl);

            var result = await sessionApi.CreateHostedProviderSessionAsync(request);

            context.Response.Redirect(result.LaunchUrl);
        });
    }
}