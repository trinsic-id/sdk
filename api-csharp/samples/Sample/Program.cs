using Microsoft.Extensions.FileProviders;
using Sample;
using Trinsic.Api.Api;
using Trinsic.Api.Client;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

var configuration = new Configuration()
{
    AccessToken = Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN")!
};

var networkApi = new NetworkApi(configuration);
var sessionApi = new SessionsApi(configuration);

app.MapSharedRoutes(sessionApi, networkApi);
app.MapWidgetRoutes(sessionApi);
app.MapSimpleProviderRoutes(sessionApi);
app.MapAdvancedProviderRoutes(sessionApi);

//Serve web sdk
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "../../../ui-web/samples/dist/assets")),
    RequestPath = "/assets"
});

app.Run();

