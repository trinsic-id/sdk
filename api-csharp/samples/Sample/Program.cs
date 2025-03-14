using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.FileProviders;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Model;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

var configuration = new Configuration()
{
    AccessToken = Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN")!
};

var networkApi = new NetworkApi(configuration);
var sessionApi = new SessionsApi(configuration);

app.MapGet("/", context => ServeFile(context, "../../../ui-web/samples/dist/index.html"));
app.MapGet("/redirect", context => ServeFile(context, "../../../ui-web/samples/dist/redirect.html"));
app.MapGet("/widget", context => ServeFile(context, "../../../ui-web/samples/dist/widget.html"));
app.MapGet("/simple", context => ServeFile(context, "../../../ui-web/samples/dist/simple.html"));
app.MapGet("/advanced", context => ServeFile(context, "../../../ui-web/samples/dist/advanced.html"));
app.MapGet("/advanced-popup", context => ServeFile(context, "../../../ui-web/samples/dist/advanced-popup.html"));

app.MapGet("/providers", async context =>   
{
    var providers = await networkApi.ListProvidersAsync();
    await context.Response.WriteAsJsonAsync(providers);
});

app.MapGet("/hosted-launch/{providerId}", async (HttpContext context, string providerId) =>
{
    var redirectUrl = context.Request.Query["redirectUrl"].ToString();

    var request = new CreateHostedProviderSessionRequest(providerId, null, redirectUrl);

    var result = await sessionApi.CreateHostedProviderSessionAsync(request);

    context.Response.Redirect(result.LaunchUrl);
});

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

    var request = new CreateAdvancedProviderSessionRequest(capabilities, fallbackToTrinsicUI, providerId, null, redirectUrl);

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
    var result = await sessionApi.GetSessionResultAsync(sessionId, new GetSessionResultRequest(request.ResultsAccessKey));
    await context.Response.WriteAsJsonAsync(result, new JsonSerializerOptions()
    {
        Converters = { new JsonStringEnumConverter() }
    });
});

app.MapPost("/create-session", async context =>
{
    var redirectUrl = context.Request.Query["redirectUrl"].ToString();
    var result = await sessionApi.CreateWidgetSessionAsync(new CreateWidgetSessionRequest()
    {
        RedirectUrl = redirectUrl
    });
    await context.Response.WriteAsJsonAsync(result);
});

app.MapPost("/exchange-result", async context =>
{
    try
    {
        // Read and deserialize the request body
        var request = await context.Request.ReadFromJsonAsync<ExchangeResultRequest>();

        // Call the method to exchange the results key
        var result = await sessionApi.GetSessionResultAsync(request.SessionId, new GetSessionResultRequest(request.ResultsAccessKey));

        // Return the result as JSON
        await context.Response.WriteAsJsonAsync(result);
    }
    catch (Exception e)
    {
        // Log the exception
        Console.Error.WriteLine(e);

        // Set the response status code to 500 Internal Server Error
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("An error occurred while processing your request.");
    }
});


//Serve web sdk
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "../../../ui-web/samples/dist/assets")),
    RequestPath = "/assets"
});

app.Run();

async Task ServeFile(HttpContext context, string file)
{
    var htmlContent = await File.ReadAllTextAsync(file);
    context.Response.ContentType = "text/html";
    await context.Response.WriteAsync(htmlContent);
}