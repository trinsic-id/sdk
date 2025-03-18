using System.Text.Json;
using System.Text.Json.Serialization;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Model;

namespace Sample;

public static class AdvancedProviderSession
{
    public static void MapAdvancedProviderSessionRoutes(this WebApplication app, SessionsApi sessionApi)
    {
        app.MapGet("/advanced", context => Shared.ServeFile(context, "../../../ui-web/samples/dist/advanced.html"));
        app.MapGet("/advanced-popup",
            context => Shared.ServeFile(context, "../../../ui-web/samples/dist/advanced-popup.html"));

        app.MapPost("/refresh-content/{sessionId}", async (HttpContext context, string sessionId) =>
        {
            var request = await context.Request.ReadFromJsonAsync<ResultsAccessKeyBody>();
            var result = await sessionApi.RefreshStepContentAsync(Guid.Parse(sessionId), new RefreshStepContentRequest()
            {
                ResultsAccessKey = request.ResultsAccessKey
            });
            await context.Response.WriteAsJsonAsync(result);
        });

        app.MapGet("/advanced-launch/{providerId}", async (HttpContext context, string providerId) =>
        {
            var fallbackToTrinsicUI = bool.Parse(context.Request.Query["fallbackToTrinsicUI"].ToString());
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();
            var capabilities = context.Request.Query["capabilities"].SelectMany(x => x.Split(','))
                .Select(x => (IntegrationCapability)Enum.Parse(typeof(IntegrationCapability), x)).ToList();

            var request =
                new CreateAdvancedProviderSessionRequest(capabilities, fallbackToTrinsicUI, providerId, null,
                    redirectUrl);

            try
            {
                var result = await sessionApi.CreateAdvancedProviderSessionAsync(request);
                if (result.NextStep.Method == IntegrationLaunchMethod.LaunchBrowser)
                {
                    context.Response.Redirect(result.NextStep.Content);
                }
                else
                {
                    var shouldRefresh = result.NextStep.Refresh != null;
                    var refreshAfter = shouldRefresh ? result.NextStep.Refresh.RefreshAfter : DateTimeOffset.MaxValue;
                    context.Response.Redirect(
                        $"/advanced-popup?sessionId={result.SessionId}&resultsAccessKey={result.ResultCollection.ResultsAccessKey}&nextStep={result.NextStep.Method}&content={System.Web.HttpUtility.UrlEncode(result.NextStep.Content)}&shouldRefresh={shouldRefresh}&refreshAfter={System.Web.HttpUtility.UrlEncode(refreshAfter.ToString("O"))}");
                }
            }
            catch (ApiException exception)
            {
                var content = (string)exception.ErrorContent;
                context.Response.Redirect(
                    $"/advanced-popup?error={System.Web.HttpUtility.UrlEncode(content)}");
            }
        });

        app.MapPost("/poll-results/{sessionId}", async (HttpContext context, string sessionId) =>
        {
            var request = await context.Request.ReadFromJsonAsync<ResultsAccessKeyBody>();
            var result =
                await sessionApi.GetSessionResultAsync(sessionId,
                    new GetSessionResultRequest(request.ResultsAccessKey));
            await context.Response.WriteAsJsonAsync(result, new JsonSerializerOptions()
            {
                Converters = { new JsonStringEnumConverter() }
            });
        });
    }
}