using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class WidgetSession
{
    public static void MapWidgetSessionRoutes(this WebApplication app, ISessionsApi sessionApi)
    {
        app.MapPost("/create-widget-session", async context =>
        {
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();
            var response = await sessionApi.CreateWidgetSessionAsync(new CreateWidgetSessionRequest(EnvironmentHelper.GetVerificationProfileIdOrThrow())
            {
                RedirectUrl = redirectUrl
            });
            response.LogAndThrowIfError(app.Logger);

            await context.Response.WriteAsJsonAsync(response.Ok());
        });
    }
}