import id.trinsic.ApiClient;
import id.trinsic.api.models.AadhaarLanguage;
import id.trinsic.api.models.CreateHostedProviderSessionRequest;
import id.trinsic.api.models.RecommendProviderInformation;
import java.util.Arrays;

public class ConstructionProbe {
    public static void main(String[] args) throws Exception {
        var mapper = new ApiClient().getObjectMapper();
        var language = mapper.readValue("{\"languageCode\":\"en\",\"languageName\":\"English\"}", AadhaarLanguage.class);
        if (!"en".equals(language.getLanguageCode()) || !"English".equals(language.getLanguageName()))
            throw new AssertionError("Private Jackson constructor lost read-only data");
        var provider = mapper.readValue("{\"id\":\"provider-a\",\"name\":\"Provider\",\"logoUrl\":\"https://example.test/logo\",\"subtext\":\"text\",\"health\":\"healthy\",\"regions\":[],\"countries\":[],\"subdivisions\":[]}", RecommendProviderInformation.class);
        if (!"provider-a".equals(provider.getId()) || !"Provider".equals(provider.getName()))
            throw new AssertionError("Read-only string fields were rebound");
        var request = new CreateHostedProviderSessionRequest().provider("provider-b").redirectUrl("https://example.test");
        var json = mapper.readTree(mapper.writeValueAsString(request));
        if (!"provider-b".equals(json.get("provider").asText()) || !"https://example.test".equals(json.get("redirectUrl").asText()))
            throw new AssertionError("Named setters changed request serialization");
        for (var type : new Class<?>[] { AadhaarLanguage.class, RecommendProviderInformation.class, CreateHostedProviderSessionRequest.class })
            if (Arrays.stream(type.getConstructors()).anyMatch(c -> c.getParameterCount() != 0))
                throw new AssertionError("Public positional model constructor: " + type);
        System.out.println("Named construction and private Jackson constructors passed");
    }
}
