using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class WidgetSession
{
    public static void MapWidgetSessionRoutes(this WebApplication app, ISessionsApi sessionApi)
    {
        app.MapGet("/widget", context => Shared.ServeFile(context, "../../../ui-web/samples/dist/widget.html"));
        app.MapPost("/create-session", async context =>
        {
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();
            var response = await sessionApi.CreateWidgetSessionAsync(new CreateWidgetSessionRequest()
            {
                RedirectUrl = redirectUrl
            });
            if (!response.IsOk)
            {
                throw new HttpRequestException(response.RawContent);
            }
            await
                context.Response.WriteAsJsonAsync(response.Ok());
        });
    }
}