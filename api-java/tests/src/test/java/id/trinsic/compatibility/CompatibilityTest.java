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
import java.net.CookieManager;
import java.net.URI;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.concurrent.Flow;
import java.util.concurrent.CompletableFuture;
import org.openapitools.jackson.nullable.JsonNullable;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.fail;

/** Native JUnit coverage for the Java compatibility catalog. */
@ExtendWith(CompatibilityResultExtension.class)
class CompatibilityTest {
  private ProvidersApi providers;
  private VerificationProfilesApi profiles;
  private SessionsApi sessions;
  private RedirectUrisApi redirects;
  private ApiClient client;
  private UUID profileId;
  private HttpRequest lastRequest;

  @BeforeEach void configureClient() {
    URI uri = URI.create(required("TRINSIC_TEST_BASE_URL"));
    client = Configuration.getDefaultApiClient();
    client.setScheme(uri.getScheme()).setHost(uri.getHost()).setPort(uri.getPort()).setBasePath(uri.getPath());
    client.setRequestInterceptor(builder -> { builder.header("Authorization", "Bearer " + required("TRINSIC_TEST_ACCESS_TOKEN")); lastRequest = builder.build(); });
    profileId = UUID.fromString(required("TRINSIC_TEST_VERIFICATION_PROFILE_ID"));
    providers = new ProvidersApi(client); profiles = new VerificationProfilesApi(client);
    sessions = new SessionsApi(client); redirects = new RedirectUrisApi(client);
  }

  @Test @CompatibilityCase("api.providers.list") void listProviders() throws Exception { assertFalse(providers.listProviders(null).getProviders().isEmpty()); }
  @Test @CompatibilityCase("api.verification-profiles.get-by-id") void getVerificationProfile() throws Exception { assertEquals(profileId, profiles.getVerificationProfileById(profileId).getId()); }
  @Test @CompatibilityCase("api.verification-profiles.list") void listVerificationProfiles() throws Exception { var page = profiles.listVerificationProfiles(1, 100); assertNotNull(page.getVerificationProfiles()); assertNotNull(page.getMore()); page.getVerificationProfiles().forEach(item -> assertNotNull(item.getId())); }
  @Test @CompatibilityCase("api.sessions.list") void listSessions() throws Exception { var page = sessions.listSessions(profileId, null, null, 1, 1); assertNotNull(page.getSessions()); assertNotNull(page.getMore()); page.getSessions().forEach(item -> assertNotNull(item.getId())); assertTrue(page.getTotal() >= 0); assertEquals("1", query(lastRequest.uri(), "Page")); assertEquals("1", query(lastRequest.uri(), "PageSize")); }
  @Test @CompatibilityCase("api.redirect-uris.list") void listRedirectUris() throws Exception { var page = redirects.callList(1, 100); assertNotNull(page.getUris()); assertNotNull(page.getMore()); page.getUris().forEach(item -> assertNotNull(item.getId())); assertEquals("100", query(lastRequest.uri(), "pageSize")); }
  @Test @CompatibilityCase("api.providers.get") void getProvider() throws Exception { assertEquals("trinsic-test-redirect", providers.getProvider("trinsic-test-redirect").getProvider().getId()); }

  @Test @CompatibilityCase("api.sessions.create-hosted-provider") void createHosted() throws Exception {
    var session = sessions.createHostedProviderSession(hostedRequest());
    try { assertNotNull(session.getSessionId()); assertUrl(session.getLaunchUrl()); assertFalse(session.getResultsAccessKey().isBlank()); } finally { cancelQuietly(session.getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.create-direct-provider") void createDirect() throws Exception {
    var session = sessions.createDirectProviderSession(directRequest());
    try { assertDirect(session); assertDirectRequest(); } finally { cancelQuietly(session.getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.get") void getSession() throws Exception {
    var session = sessions.createDirectProviderSession(directRequest());
    try { assertSession(sessions.getSession(session.getSessionId()).getSession(), session.getSessionId(), false, false); } finally { cancelQuietly(session.getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.cancel") void cancelSession() throws Exception {
    var session = sessions.createDirectProviderSession(directRequest());
    try { assertSession(sessions.cancelSession(session.getSessionId()).getSession(), session.getSessionId(), true, false); } finally { cancelQuietly(session.getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.recommend-providers") void recommendProviders() throws Exception {
    RecommendProvidersRequest request = new RecommendProvidersRequest(); request.setVerificationProfileId(profileId);
    var response = sessions.recommendProviders(request);
    var items = new java.util.ArrayList<>(response.getRecommendedProviders()); items.addAll(response.getRemainder());
    assertFalse(items.isEmpty());
    for (var item : items) { assertFalse(item.getId().isBlank()); assertNotNull(item.getName()); assertNotNull(item.getLogoUrl()); assertNotNull(item.getSubtext()); assertNotNull(item.getHealth()); assertNotNull(item.getCountries()); assertNotNull(item.getRegions()); assertNotNull(item.getSubdivisions()); }
    assertEquals(profileId.toString().toLowerCase(), requestBody().path("verificationProfileId").asText().toLowerCase());
  }
  @Test @CompatibilityCase("api.sessions.get-result") void getResult() throws Exception {
    CompletedSession completed = completeSession();
    try { var result = sessionResult(completed); assertSession(result.getSession(), completed.session().getSessionId(), true, true); assertEquals("trinsic-test-redirect", result.getIdentityData().getOriginatingProviderId()); assertFalse(result.getIdentityData().getAttachments().isEmpty()); } finally { cancelQuietly(completed.session().getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.get-attachment") void getAttachment() throws Exception {
    CompletedSession completed = completeSession();
    try {
      var result = sessionResult(completed);
      assertFalse(result.getIdentityData().getAttachments().isEmpty(), "test provider returned no attachments");
      GetAttachmentRequest request = new GetAttachmentRequest(); request.setResultsAccessKey(completed.resultsAccessKey());
      var attachment = sessions.getAttachment(completed.session().getSessionId(), result.getIdentityData().getAttachments().getFirst().getId(), request);
      assertEquals("image/png", attachment.getContentType());
      assertTrue(attachment.getContent().length >= 8);
      assertArrayEquals(new byte[]{(byte)137, 80, 78, 71, 13, 10, 26, 10}, java.util.Arrays.copyOf(attachment.getContent(), 8));
    } finally { cancelQuietly(completed.session().getSessionId()); }
  }
  @Test @CompatibilityCase("api.sessions.redact") void redact() throws Exception {
    CompletedSession completed = completeSession();
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
      String caseId = fixture.path("testCaseId").asText("serialization.provider-output-round-trip");
      String providerId = fixture.path("providerId").asText();
      Map<String, String> parameters = new LinkedHashMap<>(); parameters.put("providerId", providerId);
      if (fixture.hasNonNull("sdkModelName")) parameters.put("sdkModelName", fixture.get("sdkModelName").asText());
      if (!fixture.path("hasPublicSdkModel").asBoolean()) {
        CompatibilityResultExtension.recordSkipped(caseId, "Provider has no public Swagger provider-specific output model.", parameters);
        continue;
      }
      String modelName = fixture.path("sdkModelName").asText();
      Class<?> model = providerModel(modelName);
      if (model == null) {
        CompatibilityResultExtension.recordSkipped(caseId, "Model is not exported by this SDK release.", parameters);
        continue;
      }
      JsonNode output = fixture.path("output");
      JsonNode expected = fixture.has("serializationOutput") ? fixture.get("serializationOutput") : output;
      allPassed &= CompatibilityResultExtension.recordCase(caseId, parameters, () -> {
        RequiredFieldValidator.validate(client.getObjectMapper(), output, model, providerId + " (" + modelName + ")");
        Object decoded = client.getObjectMapper().treeToValue(output, model);
        compareJson(modelFields(decoded, output, true), modelFields(decoded, output, false), providerId, true);
        compareJson(client.getObjectMapper().valueToTree(decoded), fixture.has("testCaseId") ? expected : modelFields(decoded, expected, false), providerId + " (" + modelName + ")", true);
      });
    }
    if (!allPassed) fail("One or more provider-output fixtures failed; see the structured compatibility report.");
  }

  private static void assertUrl(String url) { URI uri = URI.create(url); assertTrue(("http".equals(uri.getScheme()) || "https".equals(uri.getScheme())) && uri.getHost() != null); }
  static void assertSession(id.trinsic.api.models.Session session, UUID id, boolean done, boolean success) {
    assertEquals(id.toString().toLowerCase(), session.getId().toString().toLowerCase()); assertEquals(done, session.getDone()); assertEquals(success, session.getSuccess());
  }
  private void assertDirect(CreateDirectProviderSessionResponse session) {
    assertNotNull(session.getSessionId()); assertUrl(session.getNextStep().getContent());
    assertEquals("LaunchBrowser", session.getNextStep().getMethod().toString());
    assertEquals("CaptureRedirect", session.getResultCollection().getMethod().toString());
    assertFalse(session.getResultCollection().getResultsAccessKey().isBlank());
  }
  private JsonNode requestBody() throws Exception {
    var bytes = new ByteArrayOutputStream(); var complete = new CompletableFuture<Void>();
    lastRequest.bodyPublisher().orElseThrow().subscribe(new Flow.Subscriber<ByteBuffer>() {
      public void onSubscribe(Flow.Subscription subscription) { subscription.request(Long.MAX_VALUE); }
      public void onNext(ByteBuffer value) { byte[] part = new byte[value.remaining()]; value.get(part); bytes.writeBytes(part); }
      public void onError(Throwable error) { complete.completeExceptionally(error); }
      public void onComplete() { complete.complete(null); }
    });
    complete.join(); return client.getObjectMapper().readTree(bytes.toByteArray());
  }
  private void assertDirectRequest() throws Exception {
    var body = requestBody();
    assertEquals("trinsic-test-redirect", body.path("provider").asText());
    assertEquals(profileId.toString().toLowerCase(), body.path("verificationProfileId").asText().toLowerCase());
    assertEquals(client.getObjectMapper().readTree("[\"LaunchBrowser\",\"CaptureRedirect\"]"), body.get("capabilities"));
    assertTrue(body.path("fallbackToHostedUI").isBoolean()); assertFalse(body.get("fallbackToHostedUI").booleanValue());
  }
  JsonNode modelFields(Object model, JsonNode wire, boolean decoded) throws Exception {
    var mapper = client.getObjectMapper();
    if (model instanceof JsonNullable<?> nullable) model = nullable.orElse(null);
    if (model instanceof Map<?, ?> map && wire.isObject()) {
      if (decoded) assertEquals(wire.size(), map.size(), "SDK changed dictionary keys");
      var output = mapper.createObjectNode();
      var fields = wire.fields();
      while (fields.hasNext()) { var field = fields.next(); if (decoded) assertTrue(map.containsKey(field.getKey()), "SDK omitted dictionary entry"); output.set(field.getKey(), modelFields(map.get(field.getKey()), field.getValue(), decoded)); }
      return output;
    }
    if (model instanceof List<?> list && wire.isArray()) {
      assertEquals(wire.size(), list.size(), "SDK changed array length");
      var output = mapper.createArrayNode();
      for (int i = 0; i < list.size(); i++) output.add(modelFields(list.get(i), wire.get(i), decoded));
      return output;
    }
    if (model != null && wire.isObject()) {
      var properties = mapper.getDeserializationConfig().introspect(mapper.constructType(model.getClass())).findProperties();
      if (!properties.isEmpty()) {
        var output = mapper.createObjectNode();
        for (var property : properties) if (wire.has(property.getName()) && property.getAccessor() != null)
          output.set(property.getName(), modelFields(property.getAccessor().getValue(model), wire.get(property.getName()), decoded));
        return output;
      }
    }
    return decoded ? mapper.valueToTree(model) : wire;
  }

  private CreateHostedProviderSessionRequest hostedRequest() throws Exception {
    CreateHostedProviderSessionRequest request = new CreateHostedProviderSessionRequest();
    request.setProvider("trinsic-test-redirect"); request.setVerificationProfileId(profileId); request.setRedirectUrl(redirectUrl()); return request;
  }
  private CreateDirectProviderSessionRequest directRequest() throws Exception {
    CreateDirectProviderSessionRequest request = new CreateDirectProviderSessionRequest();
    request.setProvider("trinsic-test-redirect"); request.setVerificationProfileId(profileId); request.setRedirectUrl(redirectUrl());
    request.setCapabilities(List.of(IntegrationCapability.LAUNCH_BROWSER, IntegrationCapability.CAPTURE_REDIRECT)); request.setFallbackToHostedUI(false);
    return request;
  }
  private String redirectUrl() throws Exception {
    return redirects.callList(1, 100).getUris().stream().map(entry -> entry.getUri())
      .filter(value -> { try { String scheme = URI.create(value).getScheme(); return "https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme); } catch (IllegalArgumentException | NullPointerException error) { return false; } })
      .findFirst().orElseThrow(() -> new IllegalStateException("No HTTP(S) redirect URI is registered."));
  }

  private CompletedSession completeSession() throws Exception {
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
      return new CompletedSession(session, session.getResultCollection().getResultsAccessKey(), redirectToken);
    } catch (Exception error) {
      if (session != null) cancelQuietly(session.getSessionId());
      throw error;
    }
  }
  private id.trinsic.api.models.GetSessionResultResponse sessionResult(CompletedSession completed) throws Exception {
    GetSessionResultRequest request = new GetSessionResultRequest(); request.setResultsAccessKey(completed.resultsAccessKey());
    return sessions.getSessionResult(completed.session().getSessionId(), request);
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
    String base = uri.toString().split("[?#]", 2)[0];
    return URI.create(base + "?" + encoded + (uri.getRawFragment() == null ? "" : "#" + uri.getRawFragment()));
  }
  private static String query(URI uri, String name) {
    if (uri.getRawQuery() == null) return "";
    for (String pair : uri.getRawQuery().split("&")) { String[] parts = pair.split("=", 2); if (URLDecoder.decode(parts[0], StandardCharsets.UTF_8).equals(name)) return parts.length == 1 ? "" : URLDecoder.decode(parts[1], StandardCharsets.UTF_8); }
    return "";
  }
  private static Class<?> providerModel(String name) { try { return Class.forName("id.trinsic.api.models." + name); } catch (ClassNotFoundException error) { return null; } }
  static void compareJson(JsonNode actual, JsonNode expected, String path, boolean exactFields) {
    if (actual.isObject()) {
      if (!expected.isObject()) fail(path + ": SDK produced an object for " + expected.getNodeType());
      Iterator<String> names = exactFields ? expected.fieldNames() : actual.fieldNames();
      while (names.hasNext()) { String name = names.next(); if (!actual.has(name)) fail(path + ": SDK omitted fixture field " + name); if (!expected.has(name)) continue; compareJson(actual.get(name), expected.get(name), path + "." + name, exactFields); }
      return;
    }
    if (actual.isArray()) { assertTrue(expected.isArray(), path + ": expected an array"); assertEquals(expected.size(), actual.size(), path + ": array shape differs"); for (int index = 0; index < actual.size(); index++) compareJson(actual.get(index), expected.get(index), path + "[" + index + "]", exactFields); return; }
    if (actual.isTextual() && expected.isTextual() && timestampsEqual(actual.asText(), expected.asText())) return;
    if (actual.isNumber() && expected.isNumber() && actual.decimalValue().compareTo(expected.decimalValue()) == 0) return;
    assertEquals(expected, actual, path + ": SDK serialization differs from fixture");
  }
  private static boolean timestampsEqual(String left, String right) { try { return Instant.parse(left).equals(Instant.parse(right)); } catch (Exception ignored) { try { return OffsetDateTime.parse(left).toInstant().equals(OffsetDateTime.parse(right).toInstant()); } catch (Exception notTimestamp) { return false; } } }
  private void cancelQuietly(UUID sessionId) { if (sessionId != null) try { sessions.cancelSession(sessionId); } catch (Exception ignored) { } }
  private static String targetLabel() { return System.getenv().getOrDefault("SDK_TARGET_LABEL", "this SDK target"); }
  private static String required(String name) { String value = System.getenv(name); if (value == null || value.isBlank()) throw new IllegalStateException(name + " is required"); return value; }
  private record CompletedSession(CreateDirectProviderSessionResponse session, String resultsAccessKey, String redirectToken) { }
}
