package id.trinsic;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import io.javalin.json.JsonMapper;
import org.openapitools.jackson.nullable.JsonNullableModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.*;
import java.lang.reflect.Type;

public class CustomJacksonMapper implements JsonMapper {
    ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new Jdk8Module())
            .registerModule(new JsonNullableModule())
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Override
    public String toJsonString(Object obj, Type type) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("Serialization failed", e);
        }
    }

    @Override
    public InputStream toJsonStream(Object obj, Type type) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            objectMapper.writeValue(out, obj);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Stream serialization failed", e);
        }
    }

    @Override
    public <T> T fromJsonString(String json, Type type) {
        try {
            return objectMapper.readValue(json, objectMapper.constructType(type));
        } catch (IOException e) {
            throw new RuntimeException("Deserialization from string failed", e);
        }
    }

    @Override
    public <T> T fromJsonStream(InputStream json, Type type) {
        try {
            return objectMapper.readValue(json, objectMapper.constructType(type));
        } catch (IOException e) {
            throw new RuntimeException("Deserialization from stream failed", e);
        }
    }

    @Override
    public void writeToOutputStream(java.util.stream.Stream<?> stream, OutputStream outputStream) {
        try (Writer writer = new OutputStreamWriter(outputStream)) {
            stream.forEach(item -> {
                try {
                    writer.write(objectMapper.writeValueAsString(item));
                    writer.write("\n");
                } catch (IOException e) {
                    throw new UncheckedIOException(e);
                }
            });
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
