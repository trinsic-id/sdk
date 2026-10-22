package id.trinsic.compatibility;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.AfterAllCallback;
import org.junit.jupiter.api.extension.BeforeTestExecutionCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;

final class CompatibilityResultExtension implements BeforeAllCallback, BeforeTestExecutionCallback, TestWatcher, AfterAllCallback {
  private static final List<Map<String, Object>> RESULTS = new ArrayList<>();
  private static final Map<String, Long> STARTED = new LinkedHashMap<>();

  @Override public void beforeAll(ExtensionContext context) {
    synchronized (CompatibilityResultExtension.class) {
      RESULTS.clear();
      STARTED.clear();
    }
  }

  @Override public void beforeTestExecution(ExtensionContext context) { STARTED.put(context.getUniqueId(), System.nanoTime()); }
  @Override public void testSuccessful(ExtensionContext context) { record(context, "passed", null); }
  @Override public void testFailed(ExtensionContext context, Throwable cause) { record(context, "failed", cause); }
  @Override public void testAborted(ExtensionContext context, Throwable cause) { record(context, "skipped", cause); }

  private static synchronized void record(ExtensionContext context, String status, Throwable error) {
    CompatibilityCase annotation = context.getRequiredTestMethod().getAnnotation(CompatibilityCase.class);
    if (annotation == null) return;
    record(annotation.value(), status, error, null, STARTED.getOrDefault(context.getUniqueId(), System.nanoTime()));
  }

  static boolean recordCase(String id, Map<String, String> parameters, ThrowingRunnable action) {
    long started = System.nanoTime();
    try {
      action.run();
      record(id, "passed", null, parameters, started);
      return true;
    } catch (Throwable error) {
      record(id, "failed", error, parameters, started);
      return false;
    }
  }

  static void recordSkipped(String id, String reason, Map<String, String> parameters) {
    record(id, "skipped", new IntentionalSkip(reason), parameters, System.nanoTime());
  }

  private static synchronized void record(String id, String status, Throwable error, Map<String, String> parameters, long started) {
    Map<String, Object> result = new LinkedHashMap<>();
    result.put("id", id); result.put("status", status);
    result.put("durationMs", (System.nanoTime() - started) / 1_000_000);
    if (parameters != null && !parameters.isEmpty()) result.put("parameters", parameters);
    if ("failed".equals(status)) result.put("failure", Map.of("name", error.getClass().getName(), "message", String.valueOf(error.getMessage())));
    if ("skipped".equals(status)) result.put("skipReason", error == null ? "Skipped." : String.valueOf(error.getMessage()));
    RESULTS.add(result);
    writeResults();
  }

  @Override public void afterAll(ExtensionContext context) throws Exception {
    if (!context.getRequiredTestClass().equals(CompatibilityTest.class)) return;
    String output = System.getenv("SDK_COMPATIBILITY_RESULT_FILE");
    if (output == null || output.isBlank()) return;
    writeResults();
  }

  private static void writeResults() {
    String output = System.getenv("SDK_COMPATIBILITY_RESULT_FILE");
    if (output == null || output.isBlank()) return;
    try {
      Path path = Path.of(output); Files.createDirectories(path.getParent());
      new ObjectMapper().writerWithDefaultPrettyPrinter().writeValue(path.toFile(), Map.of("schemaVersion", 1, "testCases", RESULTS));
    } catch (Exception error) {
      throw new IllegalStateException("Could not write compatibility results to " + output, error);
    }
  }

  @FunctionalInterface interface ThrowingRunnable { void run() throws Exception; }
  private static final class IntentionalSkip extends RuntimeException {
    IntentionalSkip(String message) { super(message); }
  }
}
