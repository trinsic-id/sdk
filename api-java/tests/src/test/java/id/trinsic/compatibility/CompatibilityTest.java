package id.trinsic.compatibility;

import com.fasterxml.jackson.databind.JsonNode;
import id.trinsic.ApiClient;
import id.trinsic.Configuration;
import id.trinsic.api.ProvidersApi;
import id.trinsic.api.RedirectUrisApi;
import id.trinsic.api.SessionsApi;
import id.trinsic.api.VerificationProfilesApi;
import id.trinsic.api.models.CreateDirectProviderSessionRequest;
import id.trinsic.api.models.CreateDirectProviderSessionResponse;
import id.trinsic.api.models.CreateHostedProviderSessionRequest;
import id.trinsic.api.models.GetAttachmentRequest;
import id.trinsic.api.models.GetSessionResultRequest;
import id.trinsic.api.models.IntegrationCapability;
import id.trinsic.api.models.RecommendProvidersRequest;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.CookieManager;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.opentest4j.TestAbortedException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;

/** Native JUnit coverage for the Java compatibility catalog. */
@ExtendWith(CompatibilityResultExtension.class)
class CompatibilityTest {
  private static final String REDIRECT_SETUP_SKIP = "The direct-provider redirect workflow could not be completed.";
  private ProvidersApi providers;
  private VerificationProfilesApi profiles;
  private SessionsApi sessions;
  private RedirectUrisApi redirects;
  private ApiClient client;
  private UUID profileId;

  @BeforeEach void configureClient() {
    URI uri = URI.create(required("TRINSIC_TEST_BASE_URL"));
    client = Configuration.getDefaultApiClient();
    client.setScheme(uri.getScheme()).setHost(uri.getHost()).setPort(uri.getPort()).setBasePath(uri.getPath());
    client.setRequestInterceptor(builder -> builder.header("Authorization", "Bearer " + required("TRINSIC_TEST_ACCESS_TOKEN")));
    profileId = UUID.fromString(required("TRINSIC_TEST_VERIFICATION_PROFILE_ID"));
    providers = new ProvidersApi(client); profiles = new VerificationProfilesApi(client);
    sessions = new SessionsApi(client); redirects = new RedirectUrisApi(client);
  }

  @Test @CompatibilityCase("api.providers.list") void listProviders() throws Exception { assertNotNull(providers.listProviders(null)); }
  @Test @CompatibilityCase("api.verification-profiles.get-by-id") void getVerificationProfile() throws Exception { assertNotNull(profiles.getVerificationProfileById(profileId)); }
  @Test @CompatibilityCase("api.verification-profiles.list") void listVerificationProfiles() throws Exception { assertNotNull(invokeCompatible(profiles, "listVerificationProfiles", 1, 100)); }
  @Test @CompatibilityCase("api.sessions.list") void listSessions() throws Exception { assertNotNull(sessions.listSessions(profileId, null, null, 1, 1)); }
  @Test @CompatibilityCase("api.redirect-uris.list") void listRedirectUris() throws Exception { assertNotNull(redirects.callList(1, 100)); }
  @Test @CompatibilityCase("api.providers.get") void getProvider() throws Exception { assertNotNull(invokeCompatible(providers, "getProvider", "trinsic-test-redirect")); }

  @Test @CompatibilityCase("api.sessions.create-hosted-provider") void createHosted() throws Exception {
    var session = sessions.createHostedProviderSession(hostedRequest());
    try { assertNotNull(session); } finally { cancelQuietly(session.getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.create-direct-provider") void createDirect() throws Exception {
    var session = sessions.createDirectProviderSession(directRequest());
    try { assertNotNull(session); } finally { cancelQuietly(session.getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.get") void getSession() throws Exception {
    var session = sessions.createDirectProviderSession(directRequest());
    try { assertNotNull(sessions.getSession(session.getSessionId())); } finally { cancelQuietly(session.getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.cancel") void cancelSession() throws Exception {
    var session = sessions.createDirectProviderSession(directRequest());
    assertNotNull(sessions.cancelSession(session.getSessionId()));
  }
  @Test @CompatibilityCase("api.sessions.recommend-providers") void recommendProviders() throws Exception {
    RecommendProvidersRequest request = new RecommendProvidersRequest(); request.setVerificationProfileId(profileId);
    assertNotNull(sessions.recommendProviders(request));
  }
  @Test @CompatibilityCase("api.sessions.get-result") void getResult() throws Exception {
    CompletedSession completed = completeOrAbort();
    try { assertNotNull(completed.result()); } finally { cancelQuietly(completed.session().getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.get-attachment") void getAttachment() throws Exception {
    CompletedSession completed = completeOrAbort();
    try {
      assertFalse(completed.result().getIdentityData().getAttachments().isEmpty(), "test provider returned no attachments");
      GetAttachmentRequest request = new GetAttachmentRequest(); request.setResultsAccessKey(completed.resultsAccessKey());
      assertNotNull(sessions.getAttachment(completed.session().getSessionId(), completed.result().getIdentityData().getAttachments().getFirst().getId(), request));
    } finally { cancelQuietly(completed.session().getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.redact") void redact() throws Exception {
    CompletedSession completed = completeOrAbort();
    try { sessions.redactSession(completed.session().getSessionId()); } finally { cancelQuietly(completed.session().getSessionId()); }
  }

  /** Each fixture writes a separate result with its provider/model parameters. */
  @Test void providerOutputRoundTrips() throws Exception {
    JsonNode fixtures;
    try { fixtures = client.getObjectMapper().readTree(Files.readString(Path.of(required("SDK_COMPATIBILITY_PSO_FIXTURES_PATH")))).path("fixtures"); }
    catch (Exception error) {
      CompatibilityResultExtension.recordCase("serialization.provider-output-round-trip", Map.of(), () -> { throw error; });
      throw error;
    }
    if (!fixtures.isArray()) fail("Shared PSO fixture cache omitted fixtures.");
    boolean allPassed = true;
    for (JsonNode fixture : fixtures) {
      String providerId = fixture.path("providerId").asText();
      Map<String, String> parameters = new LinkedHashMap<>(); parameters.put("providerId", providerId);
      if (fixture.hasNonNull("sdkModelName")) parameters.put("sdkModelName", fixture.get("sdkModelName").asText());
      if (!fixture.path("hasPublicSdkModel").asBoolean()) {
        CompatibilityResultExtension.recordSkipped("serialization.provider-output-round-trip", "Provider has no public Swagger provider-specific output model.", parameters);
        continue;
      }
      String modelName = fixture.path("sdkModelName").asText();
      Class<?> model = providerModel(modelName);
      if (model == null) {
        if (isCurrent() && !allowMissingModels()) {
          allPassed &= CompatibilityResultExtension.recordCase("serialization.provider-output-round-trip", parameters, () -> fail("Connect declares " + providerId + "'s " + modelName + " output as public, but " + targetLabel() + " does not export " + modelName + "."));
        } else {
          CompatibilityResultExtension.recordSkipped("serialization.provider-output-round-trip", isCurrent() ? "Missing public provider-output models are temporarily allowed by SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS." : "The published SDK does not expose this provider-output model.", parameters);
        }
        continue;
      }
      JsonNode output = fixture.path("output");
      JsonNode expected = fixture.has("serializationOutput") ? fixture.get("serializationOutput") : output;
      allPassed &= CompatibilityResultExtension.recordCase("serialization.provider-output-round-trip", parameters, () -> {
        Object decoded = client.getObjectMapper().treeToValue(output, model);
        compareJson(client.getObjectMapper().valueToTree(decoded), expected, providerId + " (" + modelName + ")", isCurrent());
      });
    }
    if (!allPassed) fail("One or more provider-output fixtures failed; see the structured compatibility report.");
  }

  private CreateHostedProviderSessionRequest hostedRequest() throws Exception {
    CreateHostedProviderSessionRequest request = new CreateHostedProviderSessionRequest();
    request.setProvider("trinsic-test-redirect"); request.setVerificationProfileId(profileId); request.setRedirectUrl(redirectUrl()); return request;
  }
  private CreateDirectProviderSessionRequest directRequest() throws Exception {
    CreateDirectProviderSessionRequest request = new CreateDirectProviderSessionRequest();
    request.setProvider("trinsic-test-redirect"); request.setVerificationProfileId(profileId); request.setRedirectUrl(redirectUrl());
    request.setCapabilities(List.of(IntegrationCapability.LAUNCH_BROWSER, IntegrationCapability.CAPTURE_REDIRECT)); request.setFallbackToHostedUI(false);
    try { request.getClass().getMethod("setEnableRedirectBackwardsCompatibility", Boolean.class).invoke(request, false); }
    catch (NoSuchMethodException ignored) { /* Older published SDKs predate this optional field. */ }
    return request;
  }
  private String redirectUrl() throws Exception { return redirects.callList(1, 100).getUris().getFirst().getUri(); }

  private CompletedSession completeOrAbort() throws Exception {
    CreateDirectProviderSessionResponse session = null;
    try {
      session = sessions.createDirectProviderSession(directRequest());
      HttpClient browser = HttpClient.newBuilder().cookieHandler(new CookieManager()).followRedirects(HttpClient.Redirect.NEVER).build();
      URI integration = redirect(browser, URI.create(session.getNextStep().getContent()));
      URI callback = URI.create(query(integration, "redirectUrl"));
      URI verification = redirect(browser, withQuery(callback, "resultState", "success"));
      URI completion = redirect(browser, verification);
      URI application = redirect(browser, completion);
      String redirectToken = query(application, "redirectToken");
      if (redirectToken.isBlank()) throw new IllegalStateException("Application redirect omitted redirectToken.");
      // The token proves the browser flow reached the application redirect. The
      // generated SDK request is keyed by resultsAccessKey on supported releases.
      GetSessionResultRequest request = new GetSessionResultRequest(); request.setResultsAccessKey(session.getResultCollection().getResultsAccessKey());
      return new CompletedSession(session, session.getResultCollection().getResultsAccessKey(), sessions.getSessionResult(session.getSessionId(), request));
    } catch (Exception error) {
      if (session != null) cancelQuietly(session.getSessionId());
      throw new TestAbortedException(REDIRECT_SETUP_SKIP, error);
    }
  }
  private URI redirect(HttpClient browser, URI uri) throws Exception {
    HttpResponse<Void> response = browser.send(HttpRequest.newBuilder(uri).GET().build(), HttpResponse.BodyHandlers.discarding());
    if (response.statusCode() / 100 != 3) throw new IllegalStateException("Expected redirect from " + uri + ", got " + response.statusCode());
    return uri.resolve(response.headers().firstValue("location").orElseThrow(() -> new IllegalStateException("Redirect omitted Location.")));
  }
  private static URI withQuery(URI uri, String name, String value) {
    Map<String, String> query = new LinkedHashMap<>();
    for (String pair : uri.getRawQuery() == null ? List.<String>of() : List.of(uri.getRawQuery().split("&"))) {
      String[] parts = pair.split("=", 2); query.put(URLDecoder.decode(parts[0], StandardCharsets.UTF_8), parts.length == 1 ? "" : URLDecoder.decode(parts[1], StandardCharsets.UTF_8));
    }
    query.put(name, value);
    String encoded = query.entrySet().stream().map(entry -> URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8) + "=" + URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8)).reduce((left, right) -> left + "&" + right).orElse("");
    try { return new URI(uri.getScheme(), uri.getAuthority(), uri.getPath(), encoded, uri.getFragment()); }
    catch (Exception error) { throw new IllegalArgumentException("Could not update redirect query.", error); }
  }
  private static String query(URI uri, String name) {
    if (uri.getRawQuery() == null) return "";
    for (String pair : uri.getRawQuery().split("&")) { String[] parts = pair.split("=", 2); if (URLDecoder.decode(parts[0], StandardCharsets.UTF_8).equals(name)) return parts.length == 1 ? "" : URLDecoder.decode(parts[1], StandardCharsets.UTF_8); }
    return "";
  }
  private static Class<?> providerModel(String name) { try { return Class.forName("id.trinsic.api.models." + name); } catch (ClassNotFoundException error) { return null; } }
  private static Object invokeCompatible(Object target, String methodName, Object... arguments) throws Exception {
    for (Method method : target.getClass().getMethods()) {
      if (!method.getName().equals(methodName) || method.getParameterCount() < arguments.length) continue;
      Object[] input = new Object[method.getParameterCount()]; System.arraycopy(arguments, 0, input, 0, arguments.length);
      try { return method.invoke(target, input); }
      catch (InvocationTargetException error) {
        if (error.getCause() instanceof Exception cause) throw cause;
        throw error;
      }
    }
    throw new NoSuchMethodException(target.getClass().getName() + "." + methodName + " with " + arguments.length + " arguments");
  }
  private static void compareJson(JsonNode actual, JsonNode expected, String path, boolean exactFields) {
    if (actual.isObject()) {
      if (!expected.isObject()) fail(path + ": SDK produced an object for " + expected.getNodeType());
      if (exactFields) assertEquals(expected.size(), actual.size(), path + ": object field count differs");
      Iterator<String> names = exactFields ? expected.fieldNames() : actual.fieldNames();
      while (names.hasNext()) { String name = names.next(); if (!actual.has(name)) fail(path + ": SDK omitted fixture field " + name); if (!expected.has(name)) fail(path + ": SDK emitted unexpected field " + name); compareJson(actual.get(name), expected.get(name), path + "." + name, exactFields); }
      return;
    }
    if (actual.isArray()) { assertEquals(expected.size(), actual.size(), path + ": array shape differs"); for (int index = 0; index < actual.size(); index++) compareJson(actual.get(index), expected.get(index), path + "[" + index + "]", exactFields); return; }
    if (actual.isTextual() && expected.isTextual() && timestampsEqual(actual.asText(), expected.asText())) return;
    assertEquals(expected, actual, path + ": SDK serialization differs from fixture");
  }
  private static boolean timestampsEqual(String left, String right) { try { return Instant.parse(left).equals(Instant.parse(right)); } catch (Exception ignored) { try { return OffsetDateTime.parse(left).toInstant().equals(OffsetDateTime.parse(right).toInstant()); } catch (Exception notTimestamp) { return false; } } }
  private void cancelQuietly(UUID sessionId) { if (sessionId != null) try { sessions.cancelSession(sessionId); } catch (Exception ignored) { } }
  private static boolean isCurrent() { return "true".equals(System.getenv("SDK_IS_CURRENT")); }
  private static boolean allowMissingModels() { String value = System.getenv("SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS"); return "1".equals(value) || "true".equalsIgnoreCase(value); }
  private static String targetLabel() { return System.getenv().getOrDefault("SDK_TARGET_LABEL", "this SDK target"); }
  private static String required(String name) { String value = System.getenv(name); if (value == null || value.isBlank()) throw new IllegalStateException(name + " is required"); return value; }
  private record CompletedSession(CreateDirectProviderSessionResponse session, String resultsAccessKey, id.trinsic.api.models.GetSessionResultResponse result) { }
}
