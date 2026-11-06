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
import id.trinsic.api.models.ListSessionsResponse;
import id.trinsic.api.models.RecommendProvidersResponse;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Local regressions for the compatibility harness; no Connect credentials needed. */
class CompatibilityHarnessTest {
  private static final String SESSION = """
      {"id":"00000000-0000-4000-8000-000000000001","done":false,"success":false,"created":1,"updated":1}
      """;
  private static final String PROVIDER = """
      {"id":"provider","name":"Provider","logoUrl":"https://example.test/logo","subtext":"Description","health":"Healthy",
       "regions":[],"countries":["US"],"subdivisions":[],
       "subProviders":[{"id":"sub","name":"Sub","subtext":"Description","logoUrl":"https://example.test/sub"}]}
      """;

  private static void compareResponse(Object decoded, com.fasterxml.jackson.databind.JsonNode wire) throws Exception {
    CompatibilityTest compatibility = new CompatibilityTest();
    setField(compatibility, "client", new ApiClient());
    CompatibilityTest.compareJson(compatibility.modelFields(decoded, wire, true), compatibility.modelFields(decoded, wire, false), "response", true);
  }

  @ParameterizedTest @ValueSource(booleans = {false, true})
  void publishedSessionModelPreservesEmptyAndNonemptyPages(boolean populated) throws Exception {
    var mapper = new ApiClient().getObjectMapper();
    var wire = mapper.readTree("{\"sessions\":[" + (populated ? SESSION : "") + "],\"total\":" + (populated ? 1 : 0) + ",\"more\":false,\"futureField\":\"ignored\"}");
    compareResponse(mapper.treeToValue(wire, ListSessionsResponse.class), wire);
  }

  @ParameterizedTest @ValueSource(strings = {"truncate", "id", "total", "more"})
  void publishedSessionModelRejectsChangedFields(String mutation) throws Exception {
    var mapper = new ApiClient().getObjectMapper();
    var wire = mapper.readTree("{\"sessions\":[" + SESSION + "],\"total\":1,\"more\":false}");
    var decoded = mapper.treeToValue(wire, ListSessionsResponse.class);
    compareResponse(decoded, wire);
    switch (mutation) {
      case "truncate" -> decoded.getSessions().clear();
      case "id" -> decoded.getSessions().get(0).setId("00000000-0000-4000-8000-000000000002");
      case "total" -> decoded.setTotal(2);
      case "more" -> decoded.setMore(true);
      default -> throw new IllegalArgumentException(mutation);
    }
    assertThrows(AssertionError.class, () -> compareResponse(decoded, wire));
  }

  @ParameterizedTest @CsvSource({"recommended,unchanged", "recommended,provider", "recommended,country", "recommended,subprovider",
      "remainder,unchanged", "remainder,provider", "remainder,country", "remainder,subprovider"})
  void publishedRecommendationModelPreservesNestedFields(String field, String mutation) throws Exception {
    var mapper = new ApiClient().getObjectMapper();
    var wire = mapper.readTree("{\"recommendedProviders\":[" + PROVIDER + "],\"remainder\":[" + PROVIDER + "],\"futureField\":\"ignored\"}");
    var decoded = mapper.treeToValue(wire, RecommendProvidersResponse.class);
    compareResponse(decoded, wire);
    var providers = field.equals("recommended") ? decoded.getRecommendedProviders() : decoded.getRemainder();
    switch (mutation) {
      case "unchanged" -> { return; }
      case "provider" -> providers.clear();
      case "country" -> providers.get(0).getCountries().clear();
      case "subprovider" -> providers.get(0).getSubProviders().get(0).setName("Changed");
      default -> throw new IllegalArgumentException(mutation);
    }
    assertThrows(AssertionError.class, () -> compareResponse(decoded, wire));
  }

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
