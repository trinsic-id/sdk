using Microsoft.AspNetCore.Rewrite;
using Sample;
using Sample.Routes;
using Trinsic.Api.Api;
using Trinsic.Api.Client;

DotNetEnv.Env.NoClobber().Load();

var builder = WebApplication.CreateBuilder(new WebApplicationOptions()
{
    Args = args,
    WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "../../../../ui-web/samples/dist")
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(Environment.GetEnvironmentVariable("OWN_FRONTEND_BASE_URL") ?? "https://example.com")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(3000);
});
builder.Services.AddHttpClient<ISessionsApi, SessionsApi>(httpClient =>
    new SessionsApi(httpClient, new Configuration
    {
        AccessToken = EnvironmentHelper.GetAuthTokenOrThrow(),
        // Set TRINSIC_API_BASE_URL=https://api.eu.trinsic.id for an EU profile.
        BasePath = Environment.GetEnvironmentVariable("TRINSIC_API_BASE_URL") ?? "https://api.trinsic.id"
    }));

builder.Services.AddSingleton<IPersistence, FakePersistence>();

var app = builder.Build();

app.UseCors(options => options
    .WithOrigins(Environment.GetEnvironmentVariable("OWN_FRONTEND_BASE_URL") ?? "https://example.com")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseMiddleware<JsonExceptionMiddleware>();
app.MapSharedRoutes();
app.MapHostedProviderSessionRoutes();
app.MapDirectProviderSessionRoutes();

//Serve web sdk
app.UseRewriter(new RewriteOptions()
    .Add(new HtmlFallbackRewriteRule()));
app.UseStaticFiles();

app.Run();
