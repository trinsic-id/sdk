import id.trinsic.ApiClient;
import id.trinsic.api.models.CreateDirectProviderSessionRequest;
import id.trinsic.api.models.IntegrationCapability;
import id.trinsic.api.models.IntegrationLaunchMethod;
import id.trinsic.api.models.IntegrationStep;
import id.trinsic.api.models.PersonData;
import id.trinsic.api.models.Session;
import id.trinsic.api.models.SessionErrorCode;
import id.trinsic.api.models.Sex;
import java.util.List;

public class UnknownEnumsProbe {
    static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }

    public static void main(String[] args) throws Exception {
        var mapper = new ApiClient().getObjectMapper();
        // A value added to the API after this SDK was generated must not fail the response.
        var step = mapper.readValue("{\"method\":\"FutureLaunchMethod\",\"content\":\"content\"}", IntegrationStep.class);
        check(step.getMethod() == IntegrationLaunchMethod.UNKNOWN_DEFAULT_OPEN_API && "content".equals(step.getContent()), "Required enum did not fall back");
        var session = mapper.readValue("{\"id\":\"session-id\",\"done\":true,\"success\":false,\"errorCode\":\"FutureErrorCode\",\"created\":1,\"updated\":2}", Session.class);
        check(session.getErrorCode() == SessionErrorCode.UNKNOWN_DEFAULT_OPEN_API && "session-id".equals(session.getId()), "Nullable enum did not fall back");
        var request = mapper.readValue("{\"provider\":\"provider\",\"verificationProfileId\":\"00000000-0000-0000-0000-000000000001\",\"capabilities\":[\"LaunchBrowser\",\"FutureCapability\"],\"enableRedirectBackwardsCompatibility\":false}", CreateDirectProviderSessionRequest.class);
        check(List.of(IntegrationCapability.LAUNCH_BROWSER, IntegrationCapability.UNKNOWN_DEFAULT_OPEN_API).equals(request.getCapabilities()), "Enum list did not fall back");

        // Known values, including a real member named Unknown, and nulls are unchanged.
        check(mapper.readValue("{\"sex\":\"Unknown\"}", PersonData.class).getSex() == Sex.UNKNOWN, "Known value was replaced");
        check(mapper.readValue("{\"sex\":null}", PersonData.class).getSex() == null, "Null became a value");
        check("\"LaunchBrowser\"".equals(mapper.writeValueAsString(IntegrationLaunchMethod.LAUNCH_BROWSER)), "Enum serialization changed");
        System.out.println("Unknown enum values fell back");
    }
}
