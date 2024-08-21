using Microsoft.Extensions.FileProviders;
using Trinsic.Connect.Api;
using Trinsic.Connect.Client;
using Trinsic.Connect.Model;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

var configuration = new Configuration()
{
    AccessToken = Environment.GetEnvironmentVariable("CONNECT_ACCESS_TOKEN")!
};

var networkApi = new NetworkApi(configuration);
var sessionApi = new SessionsApi(configuration);

app.MapGet("/", context => ServeFile(context, "../../web/index.html"));
app.MapGet("/redirect", context => ServeFile(context, "../../web/redirect.html"));

app.MapGet("/providers", async context =>
{
    var providers = await networkApi.ListProvidersAsync();
    await context.Response.WriteAsJsonAsync(providers);
});

app.MapGet("/launch/{providerId}", async (HttpContext context, string providerId) =>
{
    var redirectUrl = context.Request.Query["redirectUrl"].ToString();

    var request = new CreateSessionRequest
    {
        LaunchMethodDirectly = true,
        Providers = [providerId]
    };

    var result = await sessionApi.CreateSessionAsync(request);

    context.Response.Redirect(result.LaunchUrl + "&redirectUrl=" + redirectUrl + "&sessionId=" + result.Session.Id);
});

app.MapPost("/create-session", async context =>
{
    var result = await sessionApi.CreateSessionAsync(new CreateSessionRequest());
    await context.Response.WriteAsJsonAsync(result);
});

app.MapPost("/exchange-result", async context =>
{
    try
    {
        var request = await context.Request.ReadFromJsonAsync<ExchangeResultRequest>();
        var result = await sessionApi.ExchangeResultsKeyAsync(request.SessionId, new ExchangeResultsKeyRequest()
        {
            ResultsAccessKey = request.ResultsAccessKey
        });
        await context.Response.WriteAsJsonAsync(result);
    }
    catch (Exception e)
    {
        Console.Error.WriteLine(e);
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("An error occurred while processing your request.");
    }
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "../../web/dist/connect-web")),
    RequestPath = "/dist/connect-web"
});

app.Run();


async Task ServeFile(HttpContext context, string file)
{
    var htmlContent = await File.ReadAllTextAsync(file);
    context.Response.ContentType = "text/html";
    await context.Response.WriteAsync(htmlContent);
}