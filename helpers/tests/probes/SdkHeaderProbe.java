import id.trinsic.ApiClient;
import id.trinsic.api.ProvidersApi;
import id.trinsic.api.SessionsApi;
import java.net.URI;
import java.util.Map;
import java.util.UUID;

public class SdkHeaderProbe {
    public static void main(String[] args) throws Exception {
        URI url = URI.create(System.getenv("SDK_TEST_URL"));
        ApiClient client = new ApiClient()
            .setScheme(url.getScheme()).setHost(url.getHost()).setPort(url.getPort()).setBasePath("")
            .setRequestInterceptor(builder -> builder.header("Authorization", "Bearer sdk-header-test-token"));
        Map<String, String> headers = Map.of("X-Test-Header", "preserved");
        new ProvidersApi(client).listProviders(null, headers);
        new SessionsApi(client).cancelSession(UUID.fromString("00000000-0000-0000-0000-000000000001"), headers);
    }
}
