import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function required(name) { const value = process.env[name]; if (!value) throw new Error(`${name} is required`); return value; }
export const SDK_VERSION = "3.2.0";
export function temporaryDirectory(prefix, action) {
  const directory = mkdtempSync(join(tmpdir(), prefix));
  try { return action(directory); } finally { rmSync(directory, { recursive: true, force: true }); }
}
export function command(executable, args, { cwd, env = process.env, check = true } = {}) {
  const result = spawnSync(executable, args, { cwd, env, encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (check && result.status !== 0) throw new Error(`${executable} ${args.join(" ")} exited with code ${result.status ?? "unknown"}.`);
  return result;
}
export function childEnvironment(values) { return { ...process.env, ...values }; }
export function readTestCases(path) {
  if (!existsSync(path)) return undefined;
  try { const parsed = JSON.parse(readFileSync(path)); return parsed.schemaVersion === 1 && Array.isArray(parsed.testCases) ? parsed.testCases : undefined; } catch { return undefined; }
}
export function preserveProcessFailure(testCases, execution, language, label, nativeFailures) {
  const detail = execution.error?.message ?? (execution.signal ? `signal ${execution.signal}` : `code ${execution.status ?? "unknown"}`);
  if (!testCases) return failure(language, `${label} exited with ${detail} before producing structured results.`);
  if (nativeFailures) {
    const recorded = new Set(testCases.filter((testCase) => testCase.status === "failed").map((testCase) => testCase.nativeTest));
    testCases = [...testCases, ...nativeFailures.filter(({ name }) => !recorded.has(name)).flatMap(({ name, message }) =>
      failure(language, `${label}: unrecorded native failure in ${name}: ${message}`))];
  }
  // PHPUnit uses 2 for test errors; the other native runners use 1.
  const testFailureExit = execution.status === 1 || (language === "php" && execution.status === 2);
  if (execution.status !== 0 && (!testFailureExit || (nativeFailures ? nativeFailures.length === 0 : !testCases.some((testCase) => testCase.status === "failed")))) {
    return [...testCases, ...failure(language, `${label} exited with ${detail} without a complete accounting of native failures.`)];
  }
  return testCases;
}
export function readProcessTestCases(path, execution, language, label = `${language} target`) {
  return preserveProcessFailure(readTestCases(path), execution, language, label);
}
export function readNativeTestCases(path, execution, language, format, reportPath) {
  const testCases = readTestCases(path);
  const report = spawnSync("python3", [new URL("./read-native-results.py", import.meta.url).pathname, format, reportPath], { encoding: "utf8" });
  if (report.status !== 0) return [...(testCases ?? []), ...failure(language, `Cannot reconcile ${language} native test results: ${report.stderr?.trim().split("\n").at(-1) || report.error?.message || "report unavailable"}`)];
  return preserveProcessFailure(testCases, execution, language, `${language} target`, JSON.parse(report.stdout))
    .map(({ nativeTest, ...testCase }) => testCase);
}
export function failure(language, message) { return [{ id: `framework.${language}-runner`, status: "failed", durationMs: 0, failure: { name: "TestRunnerError", message } }]; }
export function writeExecutorResult({ sdkVersion, testCases }) {
  if (sdkVersion && sdkVersion !== SDK_VERSION) testCases.push(...failure("package", `Expected SDK ${SDK_VERSION}, installed ${sdkVersion}.`)); writeFileSync(required("SDK_COMPATIBILITY_RESULT_FILE"), `${JSON.stringify({ schemaVersion: 1, ...(sdkVersion ? { sdkVersion } : {}), testCases }, null, 2)}\n`); }
