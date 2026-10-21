import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function required(name) { const value = process.env[name]; if (!value) throw new Error(`${name} is required`); return value; }
export function target() {
  return { isCurrent: process.env.SDK_IS_CURRENT === "true", label: required("SDK_COMPATIBILITY_TARGET_LABEL"), packagePath: process.env.SDK_COMPATIBILITY_TARGET_PACKAGE || undefined, version: process.env.SDK_COMPATIBILITY_TARGET_VERSION || undefined };
}
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
export function failure(language, message) { return [{ id: `framework.${language}-runner`, status: "failed", durationMs: 0, failure: { name: "TestRunnerError", message } }]; }
export function writeExecutorResult({ sdkVersion, testCases }) { writeFileSync(required("SDK_COMPATIBILITY_RESULT_FILE"), `${JSON.stringify({ schemaVersion: 1, ...(sdkVersion ? { sdkVersion } : {}), testCases }, null, 2)}\n`); }
