import id.trinsic.ApiClient;
import id.trinsic.api.VerificationProfilesApi;
import java.net.URI;
import java.nio.file.Files;
import java.util.List;

public class WireProbe {
    public static void main(String[] args) throws Exception {
        URI url = URI.create(System.getenv("SDK_TEST_URL"));
        ApiClient client = new ApiClient().setScheme(url.getScheme()).setHost(url.getHost()).setPort(url.getPort()).setBasePath("");
        var api = new VerificationProfilesApi(client);
        api.createVerificationProfile("alias", "brand", null, null, null, null, null, null, null);
        api.createVerificationProfile("alias", "brand", null, null, null, null, null, null, null);
        api.createVerificationProfile("alias", "brand", null, null, List.of(), null, null, null, null);
        api.createVerificationProfile("alias", "brand", null, null, List.of("provider-one"), null, null, null, null);
        var logo = Files.createTempFile("sdk-logo", ".png");
        try {
            Files.writeString(logo, "logo bytes");
            api.createVerificationProfile("alias", "brand", null, null, null, logo.toFile(), null, null, null);
            api.createVerificationProfile("alias", "brand", null, null, List.of("provider-one"), logo.toFile(), null, null, null);
        } finally { Files.delete(logo); }
    }
}
