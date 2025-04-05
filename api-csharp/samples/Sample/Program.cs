using Microsoft.Extensions.FileProviders;
using Sample;
using Trinsic.Api;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Extensions;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApi(options =>
{
    // the type of token here depends on the api security specifications
    options.AddTokens(new BearerToken(Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN")));
});

var app = builder.Build();
var sessionApi = app.Services.GetService<ISessionsApi>()!;
var networkApi = app.Services.GetService<INetworkApi>()!;
app.MapSharedRoutes(sessionApi, networkApi);
app.MapWidgetSessionRoutes(sessionApi);
app.MapHostedProviderSessionRoutes(sessionApi);
app.MapAdvancedProviderSessionRoutes(sessionApi);

//Serve web sdk
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "../../../ui-web/samples/dist/assets")),
    RequestPath = "/assets"
});

app.Run();

