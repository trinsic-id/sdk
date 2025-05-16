using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.FileProviders;
using Sample;
using Trinsic.Api;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Extensions;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(new WebApplicationOptions()
{
    Args = args,
    WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "../../../../ui-web/samples/dist")
});
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(3000);
});
builder.Services.AddTrinsicApi(options =>
{
    // the type of token here depends on the api security specifications
    options.AddTokens(new BearerToken(Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN")));
});

var app = builder.Build();
var sessionApi = app.Services.GetService<ISessionsApi>()!;
var networkApi = app.Services.GetService<INetworkApi>()!;
app.UseMiddleware<JsonExceptionMiddleware>();
app.MapSharedRoutes(sessionApi, networkApi);
app.MapWidgetSessionRoutes(sessionApi);
app.MapHostedProviderSessionRoutes(sessionApi);
app.MapAdvancedProviderSessionRoutes(sessionApi);

//Serve web sdk
app.UseRewriter(new RewriteOptions()
    .Add(new HtmlFallbackRewriteRule()));
app.UseStaticFiles();

app.Run();