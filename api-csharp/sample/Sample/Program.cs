using Microsoft.Extensions.FileProviders;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Model;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

var configuration = new Configuration()
{
    AccessToken = Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN")!
};

var networkApi = new NetworkApi(configuration);
var sessionApi = new SessionsApi(configuration);

app.MapGet("/", context => ServeFile(context, "../../web-ui/index.html"));
app.MapGet("/redirect", context => ServeFile(context, "../../web-ui/redirect.html"));

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
        // Read and deserialize the request body
        var request = await context.Request.ReadFromJsonAsync<ExchangeResultRequest>();

        // Call the method to exchange the results key
        var result = await sessionApi.GetSessionResultAsync(request.SessionId, new GetSessionResultRequest()
        {
            ResultsAccessKey = request.ResultsAccessKey
        });

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
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "../../web/dist/web-ui")),
    RequestPath = "/dist/web-ui"
});

app.Run();


async Task ServeFile(HttpContext context, string file)
{
    var htmlContent = await File.ReadAllTextAsync(file);
    context.Response.ContentType = "text/html";
    await context.Response.WriteAsync(htmlContent);
}