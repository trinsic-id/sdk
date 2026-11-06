package id.trinsic.compatibility;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import id.trinsic.ApiClient;
import id.trinsic.api.models.MdlOutput;
import java.util.List;
import java.util.Map;
import javax.annotation.Nonnull;
import org.junit.jupiter.api.Test;
import org.openapitools.jackson.nullable.JsonNullable;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RequiredFieldValidatorTest {
  private final ObjectMapper mapper = new ApiClient().getObjectMapper();

  @Test void installedReleaseDeterminesWhetherDocumentTypeIsRequired() throws Exception {
    var value = mapper.readTree("""
      {"iacaRootCertificate":{"serialNumber":"123","commonName":"Test IACA","stateOrProvinceName":"US-CA","notBefore":"2023-03-01T17:17:39.000Z","notAfter":"2033-01-07T17:17:39.000Z"},
       "documentSignerCertificate":{"serialNumber":"123","commonName":"Test IACA","stateOrProvinceName":"US-CA","notBefore":"2023-03-01T17:17:39.000Z","notAfter":"2033-01-07T17:17:39.000Z"},
       "nameSpaces":{"org.iso.18013.5.1":{"given_name":{"type":"String","value":"Ada"}}}}
      """);
    JsonProperty annotation = MdlOutput.class.getMethod("getDocumentType").getAnnotation(JsonProperty.class);
    if (annotation != null && annotation.required()) {
      var error = assertThrows(AssertionError.class, () -> RequiredFieldValidator.validate(mapper, value, MdlOutput.class, "mdl"));
      assertTrue(error.getMessage().contains("mdl.documentType"), error.getMessage());
    } else {
      assertDoesNotThrow(() -> RequiredFieldValidator.validate(mapper, value, MdlOutput.class, "mdl"));
    }
  }

  @Test void requiredFieldsAreCheckedInsideObjectsArraysAndDictionaries() throws Exception {
    for (String payload : List.of("{\"child\":{}}", "{\"children\":[{}]}", "{\"dictionary\":{\"namespace\":{\"entry\":{}}}}")) {
      var value = mapper.readTree(payload);
      var error = assertThrows(AssertionError.class, () -> RequiredFieldValidator.validate(mapper, value, Containers.class, "provider"));
      assertTrue(error.getMessage().endsWith(".name: required field is missing from the wire payload"), error.getMessage());
    }
  }

  @Test void unknownFieldsAndAbsentOrNullOptionalPropertiesAreAllowed() throws Exception {
    for (String payload : List.of("{}", "{\"child\":null}", "{\"futureChild\":{}}", "{\"child\":{\"name\":\"Ada\",\"futureField\":{}}}")) {
      var value = mapper.readTree(payload);
      assertDoesNotThrow(() -> RequiredFieldValidator.validate(mapper, value, Containers.class, "provider"));
    }
  }

  @Test void nullableRequiredPropertiesStillRequirePresence() throws Exception {
    var missing = mapper.readTree("{}");
    assertThrows(AssertionError.class, () -> RequiredFieldValidator.validate(mapper, missing, NullableRequired.class, "provider"));
    var explicitNull = mapper.readTree("{\"child\":null}");
    assertDoesNotThrow(() -> RequiredFieldValidator.validate(mapper, explicitNull, NullableRequired.class, "provider"));
    var invalidChild = mapper.readTree("{\"child\":{}}");
    assertThrows(AssertionError.class, () -> RequiredFieldValidator.validate(mapper, invalidChild, NullableRequired.class, "provider"));
  }

  @Test void nonnullRequiredPropertyRejectsExplicitNull() throws Exception {
    var value = mapper.readTree("{\"name\":null}");
    assertThrows(AssertionError.class, () -> RequiredFieldValidator.validate(mapper, value, RequiredName.class, "provider"));
  }

  public static class RequiredName {
    @Nonnull @JsonProperty(required = true) public String name;
  }

  public static class Containers {
    public RequiredName child;
    public List<RequiredName> children;
    public Map<String, Map<String, RequiredName>> dictionary;
  }

  public static class NullableRequired {
    @JsonProperty(required = true) public JsonNullable<RequiredName> child = JsonNullable.undefined();
  }
}
