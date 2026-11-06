#!/usr/bin/env node
// This checkout tests one published release. Connect selects checkouts and applies policy.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { SDK_VERSION, failure, preserveProcessFailure, readTestCases, required } from "./executor-helpers.mjs";
import { prepareFixtures, validateCoverage, validateWireAliases } from "./fixtures.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const allLanguages = ["csharp", "go", "java", "php", "python", "ruby", "typescript"];
const languages = process.argv[2] ? [process.argv[2]] : allLanguages;
if (languages.some(language => !allLanguages.includes(language))) throw new Error("Unknown SDK language.");
const directory = resolve(process.env.SDK_COMPATIBILITY_RESULTS_DIR ?? join(root, "test-results/sdk-3.2.0"));
mkdirSync(directory, { recursive: true });
const output = join(directory, "compatibility.json");
rmSync(output, { force: true });
const scope = process.env.SDK_COMPATIBILITY_TEST_SCOPE ?? "full";
if (!["full", "serialization"].includes(scope)) throw new Error("Unknown test scope.");
const report = {
  schemaVersion: 2,
  sdkVersion: SDK_VERSION,
  run: {
    generatedAt: new Date().toISOString(), scope,
    targetBaseUrl: process.env.TRINSIC_TEST_BASE_URL?.replace(/\/$/, ""),
    commit: spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).stdout?.trim(),
  },
  fixtures: [], suites: [],
};

try {
  for (const key of ["TRINSIC_TEST_BASE_URL", "TRINSIC_TEST_ACCESS_TOKEN", "TRINSIC_TEST_VERIFICATION_PROFILE_ID"]) required(key);
  let cachePath = process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH;
  if (!cachePath) {
    cachePath = join(directory, "wire-fixtures.json");
    rmSync(cachePath, { force: true });
    const collected = await execute(join(root, "scripts/sdk-compatibility/fetch-pso-fixtures.mjs"), { SDK_COMPATIBILITY_PSO_FIXTURES_PATH: cachePath });
    if (collected.status !== 0) throw new Error("Provider-output fixture collection failed. See the collection log.");
  }
  const cache = JSON.parse(readFileSync(cachePath));
  if (!Array.isArray(cache.fixtures) || !cache.fixtures.length) throw new Error("Provider-output fixture catalog is empty or malformed.");
  const fixtures = prepareFixtures(cache);
  report.fixtures = fixtures.fixtures.map(({ providerId, sdkModelName, hasPublicSdkModel, modelRequired, testCaseId }) => ({ providerId, sdkModelName, hasPublicSdkModel, modelRequired, testCaseId: testCaseId ?? "serialization.provider-output-round-trip" }));
  const fixturePath = join(directory, "fixtures.json");
  const unavailableModels = fixtures.fixtures.filter(fixture => fixture.unavailableModel).map(fixture => ({
    id: "serialization.provider-output-round-trip", status: "skipped", durationMs: 0,
    parameters: { providerId: fixture.providerId, sdkModelName: fixture.sdkModelName },
    skipReason: fixture.unavailableModel,
  }));
  writeFileSync(fixturePath, JSON.stringify({ ...fixtures, fixtures: fixtures.fixtures.filter(fixture => !fixture.unavailableModel) }));
  const catalog = JSON.parse(readFileSync(join(root, "compatibility-tests.json"))).testCases.filter(id => scope === "full" || id.startsWith("serialization."));

  report.suites = await Promise.all(languages.map(async language => {
    const resultPath = join(directory, `${language}.json`);
    rmSync(resultPath, { force: true });
    const execution = await execute(join(root, `api-${language}/tests/run.mjs`), {
      SDK_COMPATIBILITY_RESULT_FILE: resultPath, SDK_COMPATIBILITY_PSO_FIXTURES_PATH: fixturePath,
      SDK_TARGET_LABEL: `${language} ${SDK_VERSION}`, SDK_VERSION,
    });
    const parsed = readTestCases(resultPath);
    const testCases = [...preserveProcessFailure(parsed, execution, language, "SDK test executor", []), ...unavailableModels, ...validateWireAliases(cache)];
    for (const message of validateCoverage(fixtures.fixtures, testCases)) testCases.push(...failure(language, message));
    const actual = new Set(testCases.map(testCase => testCase.id));
    const missing = catalog.filter(id => !actual.has(id));
    if (missing.length) testCases.push(...failure(language, `Missing required cases: ${missing.join(", ")}.`));
    const sdkVersion = parsed ? JSON.parse(readFileSync(resultPath)).sdkVersion : undefined;
    if (sdkVersion !== SDK_VERSION) testCases.push(...failure(language, `Expected installed SDK ${SDK_VERSION}, received ${sdkVersion ?? "no version"}.`));
    return { language, sdkVersion, testCases };
  }));
} catch (error) {
  report.suites = languages.map(language => ({ language, sdkVersion: SDK_VERSION, testCases: failure(language, error.message) }));
}

writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
for (const suite of report.suites) {
  const count = status => suite.testCases.filter(testCase => testCase.status === status).length;
  console.log(`${suite.language}: ${count("passed")} passed, ${count("failed")} failed, ${count("skipped")} skipped`);
}
console.log(`Raw SDK results: ${output}`);
process.exitCode = report.suites.some(suite => suite.testCases.some(testCase => testCase.status === "failed")) ? 1 : 0;

function execute(script, values) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, ["--use-system-ca", script], { cwd: root, env: { ...process.env, ...values }, stdio: "inherit" });
    child.on("error", error => resolve({ status: null, error }));
    child.on("close", (status, signal) => resolve({ status, signal }));
  });
}
