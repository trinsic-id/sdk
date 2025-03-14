using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class SimpleProvider
{
    public static void MapSimpleProviderRoutes(this WebApplication app, SessionsApi sessionApi)
    {
        app.MapGet("/simple", context => Shared.ServeFile(context, "../../../ui-web/samples/dist/simple.html"));
        app.MapGet("/hosted-launch/{providerId}", async (HttpContext context, string providerId) =>
        {
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();

            var request = new CreateHostedProviderSessionRequest(providerId, null, redirectUrl);

            var result = await sessionApi.CreateHostedProviderSessionAsync(request);

            context.Response.Redirect(result.LaunchUrl);
        });
    }
}