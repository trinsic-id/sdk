using Trinsic.Api.Api;
using Trinsic.Api.Client;

using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-Test-Header", "preserved");
var configuration = new Configuration
{
    AccessToken = "sdk-header-test-token",
    BasePath = Environment.GetEnvironmentVariable("SDK_TEST_URL")!
};
using var providers = new ProvidersApi(client, configuration);
using var sessions = new SessionsApi(client, configuration);
await providers.ListProvidersAsync();
await sessions.CancelSessionAsync(Guid.Parse("00000000-0000-0000-0000-000000000001"));
