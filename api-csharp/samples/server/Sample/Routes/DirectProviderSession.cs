using System.Text.Json;
using System.Text.Json.Serialization;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Model;

namespace Sample;

public static class DirectProviderSession
{
    public static void MapDirectProviderSessionRoutes(this WebApplication app, ISessionsApi sessionApi)
    {
        app.MapPost("/refresh-content/{sessionId}", async (HttpContext context, string sessionId) =>
        {
            var request = await context.Request.ReadFromJsonAsync<ResultsAccessKeyBody>();
            var response = await sessionApi.RefreshStepContentAsync(Guid.Parse(sessionId), new RefreshStepContentRequest(request.ResultsAccessKey));
            response.LogAndThrowIfError(app.Logger);
            await context.Response.WriteAsJsonAsync(response.Ok(), new JsonSerializerOptions()
            {
                Converters = { new JsonStringEnumConverter() }
            });
        });

        app.MapGet("/direct-launch/{providerId}", async (HttpContext context, string providerId) =>
        {
            var fallbackToTrinsicUI = bool.Parse(context.Request.Query["fallbackToTrinsicUI"].ToString());
            var redirectUrl = context.Request.Query["redirectUrl"].ToString();
            var capabilities = context.Request.Query["capabilities"].SelectMany(x => x.Split(','))
                .Select(x => (IntegrationCapability)Enum.Parse(typeof(IntegrationCapability), x)).ToList();

            var request =
                new CreateDirectProviderSessionRequest(capabilities, providerId, EnvironmentHelper.GetVerificationProfileIdOrThrow(),fallbackToTrinsicUI,  null,
                    redirectUrl);
            var response = await sessionApi.CreateDirectProviderSessionAsync(request);
            response.LogAndThrowIfError(app.Logger);

            var result = response.Ok();
            if (result.NextStep.Method == IntegrationLaunchMethod.LaunchBrowser)
            {
                context.Response.Redirect(result.NextStep.Content);
            }
            else
            {
                var shouldRefresh = result.NextStep.Refresh != null;
                var refreshAfter = result.NextStep.Refresh?.RefreshAfter  ?? DateTimeOffset.MaxValue;
                context.Response.Redirect(
                    $"/advanced-popup?sessionId={result.SessionId}&resultsAccessKey={result.ResultCollection.ResultsAccessKey}&nextStep={result.NextStep.Method}&content={System.Web.HttpUtility.UrlEncode(result.NextStep.Content)}&shouldRefresh={shouldRefresh.ToString().ToLowerInvariant()}&refreshAfter={System.Web.HttpUtility.UrlEncode(refreshAfter.ToString("O"))}");
            }
        });

        app.MapPost("/poll-results/{sessionId}", async (HttpContext context, string sessionId) =>
        {
            var request = await context.Request.ReadFromJsonAsync<ResultsAccessKeyBody>();
            var response =
                await sessionApi.GetSessionResultAsync(Guid.Parse(sessionId),
                    new GetSessionResultRequest(request.ResultsAccessKey));
            response.LogAndThrowIfError(app.Logger);
            await context.Response.WriteAsJsonAsync(response.Ok(), new JsonSerializerOptions()
            {
                Converters = { new JsonStringEnumConverter() },
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        });
    }
}