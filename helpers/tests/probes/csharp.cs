using Microsoft.Extensions.DependencyInjection;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Extensions;

var services = new ServiceCollection();
services.AddLogging();
services.AddTrinsicApi(options =>
{
    options.AddTokens(new BearerToken("sdk-header-test-token"));
    options.AddTrinsicApiHttpClients(client =>
    {
        client.BaseAddress = new Uri(Environment.GetEnvironmentVariable("SDK_TEST_URL")!);
        client.DefaultRequestHeaders.Add("X-Test-Header", "preserved");
    });
});
using var provider = services.BuildServiceProvider();
await provider.GetRequiredService<IProvidersApi>().ListProvidersAsync();
await provider.GetRequiredService<ISessionsApi>().CancelSessionAsync(Guid.Parse("00000000-0000-0000-0000-000000000001"));
