#!/usr/bin/env node
/**
 * Run a language's SDK compatibility matrix.
 *
 * The language executor installs one SDK target and writes a small result file
 * ({ schemaVersion: 1, sdkVersion, testCases }).  Everything that is common to
 * every language—target selection, report construction, required-case coverage—lives here.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { targetFixtures, validateWireAliases } from "./target-fixtures.mjs";
import { acknowledgeFailures, preserveProcessFailure } from "./executor-helpers.mjs";

const [language, executor, ...executorArguments] = process.argv.slice(2);
if (!language || !executor) {
  throw new Error("Usage: run-matrix.mjs <language> <executor> [executor arguments...]");
}

const root = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const testsRoot = resolve(process.env.SDK_COMPATIBILITY_TESTS_ROOT ?? join(root, `api-${language}/tests`));
const required = (name) => {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`${name} is required`);
  return value.trim();
};
const configuration = Object.fromEntries(["TRINSIC_TEST_BASE_URL", "TRINSIC_TEST_ACCESS_TOKEN", "TRINSIC_TEST_VERIFICATION_PROFILE_ID"].map((name) => [name, required(name)]));
// Every standalone language entry point needs the same wire fixtures. The
// aggregate runner supplies a shared snapshot, so it is never fetched twice.
if (!process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH) {
  const directory = mkdtempSync(join(tmpdir(), "trinsic-compat-fixtures-"));
  process.on("exit", () => rmSync(directory, { recursive: true, force: true }));
  process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH = join(directory, "fixtures.json");
  const fetched = spawnSync(process.execPath, ["--use-system-ca", join(root, "scripts/sdk-compatibility/fetch-pso-fixtures.mjs")], { env: process.env, stdio: "inherit" });
  if (fetched.status !== 0) throw new Error("Cannot run compatibility tests without the provider-output fixture snapshot.");
}
const fixtureCache = JSON.parse(readFileSync(process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH));
if (!Array.isArray(fixtureCache.fixtures) || fixtureCache.fixtures.length === 0) throw new Error("Provider-output fixture snapshot must contain a nonempty fixtures array.");
const matrix = JSON.parse(readFileSync(join(root, "compatibility.json")));
const catalog = JSON.parse(readFileSync(join(root, "compatibility-tests.json"))).testCases;
const versions = matrix.compatibility.sdkVersions[language];
if (!Array.isArray(versions)) throw new Error(`Compatibility matrix does not define ${language} SDK versions.`);

const packageLabel = process.env.SDK_COMPATIBILITY_PACKAGE_LABEL ?? language;
const versionPrefix = process.env.SDK_COMPATIBILITY_VERSION_PREFIX ?? "";
const targets = [
  currentTarget("current branch", required("SDK_COMPATIBILITY_CURRENT_PACKAGE")),
  ...mainTarget(),
  ...versions.toSorted(compareVersions).map((version) => ({ isCurrent: false, kind: "published", label: `${packageLabel}@${versionPrefix}${version}`, version })),
];
const results = targets.map(runTarget);
if (process.env.SDK_COMPATIBILITY_VALIDATE_CATALOG !== "false") {
  for (const target of results) {
    const actual = new Set(target.testCases.map((testCase) => testCase.id));
    const missing = catalog.filter((id) => !actual.has(id));
    if (missing.length) target.testCases.push(failure("framework.catalog-coverage", "CoverageError", `Missing required ${language} test cases: ${missing.join(", ")}.`));
  }
}

for (const target of results) {
  target.testCases = acknowledgeFailures(target.testCases, target, language, matrix.compatibility.acknowledgements);
}
const report = {
  schemaVersion: 1,
  run: { generatedAt: new Date().toISOString(), targetBaseUrl: configuration.TRINSIC_TEST_BASE_URL.replace(/\/$/, "") },
  suite: { language }, targets: results,
};
const output = resolve(process.env.SDK_COMPATIBILITY_RESULTS_PATH ?? join(testsRoot, ".results", "compatibility.json"));
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Structured compatibility results: ${output}`);
process.exitCode = results.some((target) => target.setupFailure || target.testCases.some((testCase) => testCase.status === "failed")) ? 1 : 0;

function currentTarget(label, packagePath, kind = "current") { return { isCurrent: true, kind, label, packagePath }; }
function mainTarget() {
  const packagePath = process.env.SDK_COMPATIBILITY_MAIN_PACKAGE;
  if (!packagePath) return [];
  const revision = process.env.SDK_ORIGIN_MAIN_REVISION;
  return [currentTarget(revision ? `origin/main (${revision})` : "origin/main", packagePath, "main")];
}
function compareVersions(left, right) { return right.localeCompare(left, undefined, { numeric: true }); }
function runTarget(target) {
  const result = { isCurrent: target.isCurrent, label: target.label, testCases: [] };
  const resultFile = join(process.env.TMPDIR ?? "/tmp", `trinsic-${language}-target-${process.pid}-${Math.random().toString(36).slice(2)}.json`);
  const aliasResults = validateWireAliases(fixtureCache, matrix.compatibility.wireAliases);
  const fixtureFile = `${resultFile}.fixtures.json`;
  writeFileSync(fixtureFile, JSON.stringify(targetFixtures(fixtureCache, target, matrix.compatibility)));
  const execution = spawnSync(executor, executorArguments, {
    cwd: testsRoot,
    encoding: "utf8",
    env: { ...process.env, ...configuration, SDK_COMPATIBILITY_PSO_FIXTURES_PATH: fixtureFile, SDK_COMPATIBILITY_LANGUAGE: language, SDK_COMPATIBILITY_RESULT_FILE: resultFile, SDK_COMPATIBILITY_TARGET_KIND: target.kind, SDK_COMPATIBILITY_TARGET_LABEL: target.label, SDK_TARGET_LABEL: target.label, SDK_COMPATIBILITY_TARGET_PACKAGE: target.packagePath ?? "", SDK_COMPATIBILITY_TARGET_VERSION: target.version ?? "", SDK_IS_CURRENT: String(target.isCurrent) },
  });
  rmSync(fixtureFile);
  if (execution.stdout) process.stdout.write(execution.stdout);
  if (execution.stderr) process.stderr.write(execution.stderr);
  if (existsSync(resultFile)) {
    try {
      const parsed = JSON.parse(readFileSync(resultFile));
      if (parsed.schemaVersion === 1 && Array.isArray(parsed.testCases)) {
        // Executors return outcomes in JSON and exit zero even for test failures.
        // Any nonzero executor exit is an additional framework failure.
        result.testCases = [...preserveProcessFailure(parsed.testCases, execution, language, `${language} executor`, []), ...aliasResults];
        if (target.isCurrent) result.testCases = result.testCases.map((testCase) => {
          if (testCase.status !== "skipped" || !testCase.id.startsWith("api.")) return testCase;
          const { skipReason, ...test } = testCase;
          return { ...test, status: "failed", failure: { name: "CoverageError", message: `Current SDK API operation was not exercised: ${skipReason ?? testCase.id}` } };
        });
        if (typeof parsed.sdkVersion === "string") result.sdkVersion = parsed.sdkVersion;
        return result;
      }
    } catch { /* turn malformed executor output into a framework failure below */ }
  }
  result.testCases = [failure(`framework.${language}-runner`, "TestRunnerError", `${language} target exited with code ${execution.status ?? "unknown"} before producing structured results.`)];
  return result;
}
function failure(id, name, message) { return { id, status: "failed", durationMs: 0, failure: { name, message } }; }
