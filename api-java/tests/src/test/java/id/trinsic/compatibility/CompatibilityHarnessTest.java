package id.trinsic.compatibility;

import com.sun.net.httpserver.HttpServer;
import id.trinsic.ApiClient;
import id.trinsic.ApiException;
import id.trinsic.api.RedirectUrisApi;
import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.CancelSessionResponse;
import id.trinsic.api.models.CreateDirectProviderSessionRequest;
import id.trinsic.api.models.CreateDirectProviderSessionResponse;
import id.trinsic.api.models.GetSessionResultRequest;
import id.trinsic.api.models.GetSessionResultResponse;
import id.trinsic.api.models.ListRedirectUrisResponse;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Local regressions for the compatibility harness; no Connect credentials needed. */
class CompatibilityHarnessTest {
  @Test void queryValuesAndRawPathAreEncodedOnce() throws Exception {
    var method = CompatibilityTest.class.getDeclaredMethod("withQuery", URI.class, String.class, String.class);
    method.setAccessible(true);
    URI input = URI.create("https://example.test/callback%2Fpart?token=a%2Fb%3D&state=x%26y%2Bz#frag%20ment");
    URI actual = (URI) method.invoke(null, input, "resultState", "success /+");
    assertEquals("https://example.test/callback%2Fpart?token=a%2Fb%3D&state=x%26y%2Bz&resultState=success+%2F%2B#frag%20ment", actual.toString());
  }

  @Test void resultApiFailureFailsTheCaseAndStillCleansUp() throws Exception {
    HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    String base = "http://127.0.0.1:" + server.getAddress().getPort();
    AtomicBoolean callbackPreserved = new AtomicBoolean(), cancelled = new AtomicBoolean();
    server.createContext("/", exchange -> {
      String location = switch (exchange.getRequestURI().getPath()) {
        case "/start" -> base + "/integration?redirectUrl=" + URLEncoder.encode(base + "/callback?token=a%2Fb%3D&state=x%26y", StandardCharsets.UTF_8);
        case "/callback" -> {
          callbackPreserved.set(exchange.getRequestURI().getRawQuery().equals("token=a%2Fb%3D&state=x%26y&resultState=success"));
          yield base + "/verification";
        }
        case "/verification" -> base + "/completion";
        default -> base + "/application?redirectToken=complete";
      };
      exchange.getResponseHeaders().set("Location", location);
      exchange.sendResponseHeaders(302, -1);
      exchange.close();
    });
    server.start();
    try {
      var mapper = new ApiClient().getObjectMapper();
      UUID sessionId = UUID.randomUUID();
      var session = mapper.readValue("{\"sessionId\":\"" + sessionId + "\",\"nextStep\":{\"content\":\"" + base + "/start\"},\"resultCollection\":{\"resultsAccessKey\":\"key\"}}", CreateDirectProviderSessionResponse.class);
      var uris = mapper.readValue("{\"uris\":[{\"uri\":\"myapp://callback\"},{\"uri\":\"" + base + "/application\"}]}", ListRedirectUrisResponse.class);
      ApiException regression = new ApiException("GetSessionResult regression");
      CompatibilityTest compatibility = new CompatibilityTest();
      setField(compatibility, "profileId", UUID.randomUUID());
      setField(compatibility, "redirects", new RedirectUrisApi() {
        @Override public ListRedirectUrisResponse callList(Integer page, Integer size) { return uris; }
      });
      setField(compatibility, "sessions", new SessionsApi() {
        @Override public CreateDirectProviderSessionResponse createDirectProviderSession(CreateDirectProviderSessionRequest request) { assertEquals(base + "/application", request.getRedirectUrl()); return session; }
        @Override public GetSessionResultResponse getSessionResult(UUID id, GetSessionResultRequest request) throws ApiException {
          assertEquals(sessionId, id);
          assertEquals("key", request.getResultsAccessKey());
          throw regression;
        }
        @Override public CancelSessionResponse cancelSession(UUID id) { cancelled.set(sessionId.equals(id)); return new CancelSessionResponse(); }
      });
      assertSame(regression, assertThrows(ApiException.class, compatibility::getResult));
      assertTrue(callbackPreserved.get(), "callback token and state changed");
      assertTrue(cancelled.get(), "failed result retrieval did not clean up the session");
    } finally { server.stop(0); }
  }

  @Test void comparatorsRejectDroppedFieldsWrongContainersAndBooleanNumbers() throws Exception {
    var mapper = new ApiClient().getObjectMapper();
    for (String[] pair : new String[][] { {"[]", "{}"}, {"true", "1"}, {"false", "0"}, {"[]", "[1]"}, {"{\"child\":{}}", "{\"child\":{\"name\":\"Ada\"}}"} }) {
      var actual = mapper.readTree(pair[0]); var expected = mapper.readTree(pair[1]);
      assertThrows(AssertionError.class, () -> CompatibilityTest.compareJson(actual, expected, "value", true));
    }
    CompatibilityTest compatibility = new CompatibilityTest(); setField(compatibility, "client", new ApiClient());
    var raw = mapper.readTree("{\"method\":\"LaunchBrowser\",\"content\":\"https://example.test\",\"future\":true}");
    var model = mapper.treeToValue(raw, id.trinsic.api.models.IntegrationStep.class);
    var expected = compatibility.modelFields(model, raw, false);
    org.junit.jupiter.api.Assertions.assertFalse(expected.has("future"));
    model.setContent(null);
    assertThrows(AssertionError.class, () -> CompatibilityTest.compareJson(compatibility.modelFields(model, raw, true), expected, "step", true));
  }

  private static void setField(Object target, String name, Object value) throws Exception {
    var field = CompatibilityTest.class.getDeclaredField(name);
    field.setAccessible(true);
    field.set(target, value);
  }
}
