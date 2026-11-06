package id.trinsic.compatibility;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.BeanPropertyDefinition;
import javax.annotation.Nonnull;

final class RequiredFieldValidator {
  private RequiredFieldValidator() { }

  static void validate(ObjectMapper mapper, JsonNode value, Class<?> model, String path) {
    validate(mapper, value, mapper.constructType(model), path);
  }

  private static void validate(ObjectMapper mapper, JsonNode value, JavaType type, String path) {
    if (value == null || value.isNull() || type == null) return;
    if (type.getRawClass().getName().equals("org.openapitools.jackson.nullable.JsonNullable")) {
      validate(mapper, value, type.containedType(0), path);
      return;
    }
    if (type.isMapLikeType() && value.isObject()) {
      value.fields().forEachRemaining(entry -> validate(mapper, entry.getValue(), type.getContentType(), path + "." + entry.getKey()));
      return;
    }
    if ((type.isCollectionLikeType() || type.isArrayType()) && value.isArray()) {
      for (int index = 0; index < value.size(); index++) validate(mapper, value.get(index), type.getContentType(), path + "[" + index + "]");
      return;
    }
    if (!value.isObject()) return;
    for (BeanPropertyDefinition property : mapper.getDeserializationConfig().introspect(type).findProperties()) {
      if (!property.couldDeserialize()) continue;
      String name = property.getName();
      String fieldPath = path + "." + name;
      if (property.isRequired() && !value.has(name)) {
        throw new AssertionError(fieldPath + ": required field is missing from the wire payload");
      }
      JsonNode field = value.get(name);
      if (property.isRequired() && field != null && field.isNull() && nonnull(property)) {
        throw new AssertionError(fieldPath + ": required non-null field is null in the wire payload");
      }
      validate(mapper, field, property.getPrimaryType(), fieldPath);
    }
  }

  private static boolean nonnull(BeanPropertyDefinition property) {
    return property.getGetter() != null && property.getGetter().hasAnnotation(Nonnull.class)
      || property.getField() != null && property.getField().hasAnnotation(Nonnull.class)
      || property.getSetter() != null && (property.getSetter().hasAnnotation(Nonnull.class)
        || property.getSetter().getParameter(0).hasAnnotation(Nonnull.class));
  }
}
