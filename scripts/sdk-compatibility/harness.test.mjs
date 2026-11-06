import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { acknowledgeFailures, readNativeTestCases, readProcessTestCases, temporaryDirectory } from "./executor-helpers.mjs";
import { targetFixtures, validateWireAliases } from "./target-fixtures.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const scripts = join(root, "scripts/sdk-compatibility");
const configuration = {
  TRINSIC_TEST_BASE_URL: "https://compatibility.invalid",
  TRINSIC_TEST_ACCESS_TOKEN: "test-only",
  TRINSIC_TEST_VERIFICATION_PROFILE_ID: "00000000-0000-0000-0000-000000000000",
};
const passed = { id: "example", status: "passed", durationMs: 0 };
const failed = { ...passed, status: "failed", failure: { name: "Error", message: "Recorded failure" } };
const json = (path) => JSON.parse(readFileSync(path, "utf8"));

test("historical provider mappings test the original integration and keep raw aliases", () => {
  const compatibility = json(join(root, "compatibility.json")).compatibility;
  const output = { firstName: "Ada", legacyAlias: "kept" };
  const cache = { fixtures: [
    { providerId: "a-freja-eid-login", sdkModelName: "FrejaIndirectProviderOutput", output, serializationOutput: { firstName: "Ada" }, legacySerializationOutput: output },
    { providerId: "freja", sdkModelName: "FrejaProviderOutput", output: { name: "Ada" } },
    { providerId: "a-itsme-login", sdkModelName: "ItsmeLoginProviderOutput", output },
  ] };
  const old = targetFixtures(cache, { isCurrent: false, version: "3.0.0" }, compatibility).fixtures;
  assert.equal(old[0].sdkModelName, "FrejaProviderOutput");
  assert.deepEqual(old[0].output, output);
  assert.deepEqual(old[0].serializationOutput, output);
  assert.match(old[1].unsupportedReason, /introduced after/);
  assert.equal(old[2].sdkModelName, "ItsmeProviderOutput");
  for (const version of ["3.0.0", "3.1.0", "3.2.1"]) {
    const current = targetFixtures(cache, { isCurrent: true, version }, compatibility).fixtures;
    assert.deepEqual(current.slice(0, 3), cache.fixtures);
  }
  assert.equal(cache.fixtures[0].sdkModelName, "FrejaIndirectProviderOutput", "target overrides must not mutate the shared snapshot");
});

test("removing or changing a legacy wire alias is a failure", () => {
  const aliases = [{ providerId: "singpass", legacyPath: "person.legacy", currentPath: "person.current" }];
  const check = (person) => validateWireAliases({ fixtures: [{ providerId: "singpass", output: { person } }] }, aliases)[0];
  assert.equal(check({ current: { code: "113" }, legacy: { code: "113" } }).status, "passed");
  assert.equal(check({ current: { code: "113" } }).status, "failed");
  assert.equal(check({ current: { code: "113" }, legacy: { code: "999" } }).status, "failed");
});
function write(path, value, executable = false) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value, { mode: executable ? 0o755 : 0o644 });
}
function run(executable, args, options = {}) {
  return spawnSync(executable, args, { encoding: "utf8", ...options, env: { ...process.env, ...options.env } });
}
function succeeded(result) { assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`); }

test("process failures survive partial reports without duplicating recorded failures", () => temporaryDirectory("compat-process-", (directory) => {
  const output = join(directory, "result.json");
  write(output, JSON.stringify({ schemaVersion: 1, testCases: [passed] }));
  assert.deepEqual(readProcessTestCases(output, { status: 0 }, "test"), [passed]);
  for (const execution of [{ status: 1 }, { status: null, signal: "SIGTERM" }, { status: null, error: new Error("spawn failed") }]) {
    const cases = readProcessTestCases(output, execution, "test");
    assert.deepEqual(cases[0], passed);
    assert.equal(cases[1].status, "failed");
    assert.match(cases[1].failure.message, /without a complete accounting/);
  }
  write(output, JSON.stringify({ schemaVersion: 1, testCases: [failed] }));
  assert.deepEqual(readProcessTestCases(output, { status: 1 }, "test"), [failed]);
  assert.deepEqual(readProcessTestCases(output, { status: 2 }, "php"), [failed], "PHPUnit reports test errors with exit 2");
  assert.equal(readProcessTestCases(output, { status: 42 }, "test").length, 2, "a recorded assertion must not hide an abnormal exit");
  write(output, "invalid JSON");
  assert.equal(readProcessTestCases(output, { status: 0 }, "test")[0].status, "failed");
  assert.equal(readProcessTestCases(join(directory, "missing"), { status: 1 }, "test")[0].status, "failed");
}));

test("native reports preserve harness failures beside acknowledged SDK failures", () => temporaryDirectory("compat-native-", (directory) => {
  for (const language of ["csharp", "java"]) {
    const acknowledgement = json(join(root, "compatibility.json")).compatibility.acknowledgements.find((entry) => entry.language === language && entry.testCaseId === "serialization.unknown-enum");
    const nativeTest = "CompatibilityTest.providerOutputs";
    const output = join(directory, `${language}-target.json`);
    const entry = { ...failed, id: acknowledgement.testCaseId, parameters: acknowledgement.parameters, nativeTest, failure: { name: "Error", message: acknowledgement.failureMessageIncludes.join(" ") } };
    write(output, JSON.stringify({ schemaVersion: 1, testCases: [entry] }));
    const nativePath = language === "csharp" ? join(directory, "native.trx") : join(directory, "surefire");
    const nativeReport = language === "csharp" ? nativePath : join(nativePath, "TEST-example.xml");
    const writeNative = (extra) => write(nativeReport, language === "csharp"
      ? `<TestRun xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010"><TestDefinitions><UnitTest id="1"><TestMethod className="CompatibilityTest" name="providerOutputs" /></UnitTest><UnitTest id="2"><TestMethod className="HarnessRegressionTests" name="regression" /></UnitTest></TestDefinitions><Results><UnitTestResult testId="1" testName="providerOutputs" outcome="Failed" />${extra ? '<UnitTestResult testId="2" testName="regression" outcome="Failed"><Output><ErrorInfo><Message>independent failure &amp; details</Message></ErrorInfo></Output></UnitTestResult>' : ''}</Results></TestRun>`
      : `<testsuite><testcase classname="CompatibilityTest" name="providerOutputs"><failure message="expected enum failure" /></testcase>${extra ? '<testcase classname="HarnessRegressionTests" name="regression"><error message="independent failure &amp; details" /></testcase>' : ''}</testsuite>`);
    const read = () => readNativeTestCases(output, { status: 1 }, language, language === "csharp" ? "trx" : "junit", nativePath);
    const check = (testCases) => acknowledgeFailures(testCases, { isCurrent: false, sdkVersion: acknowledgement.sdkVersions[0] }, language, [acknowledgement]);
    writeNative(false);
    assert.equal(read().length, 1);
    assert.equal(check(read())[0].status, "skipped");
    writeNative(true);
    const cases = read();
    assert.equal(cases.length, 2);
    assert.match(cases[1].failure.message, /HarnessRegressionTests.regression: independent failure & details/);
    assert.equal(check(cases).filter((entry) => entry.status === "failed").length, 1, "an acknowledged enum error must not suppress the native harness regression");
    write(nativeReport, "truncated XML");
    assert.ok(check(read()).some((entry) => entry.status === "failed"), "incomplete native reports must fail closed");
  }
}));

test("matrix coordinator rejects a successful report from a failed executor", () => temporaryDirectory("compat-matrix-", (directory) => {
  const executor = join(directory, "executor.mjs");
  write(executor, `import { writeFileSync } from 'node:fs';
writeFileSync(process.env.SDK_COMPATIBILITY_RESULT_FILE, JSON.stringify({ schemaVersion: 1, testCases: [${JSON.stringify(passed)}] }));
process.exitCode = 1;`);
  const output = join(directory, "matrix.json");
  const cache = join(directory, "fixtures.json");
  write(cache, JSON.stringify({ fixtures: [{ providerId: "test", hasPublicSdkModel: false }] }));
  const result = run(process.execPath, [join(scripts, "run-matrix.mjs"), "typescript", process.execPath, executor], {
    env: { ...configuration, SDK_COMPATIBILITY_CURRENT_PACKAGE: directory, SDK_COMPATIBILITY_MAIN_PACKAGE: directory, SDK_COMPATIBILITY_RESULTS_PATH: output, SDK_COMPATIBILITY_VALIDATE_CATALOG: "false", SDK_COMPATIBILITY_PSO_FIXTURES_PATH: cache },
  });
  assert.equal(result.status, 1, result.stderr);
  for (const target of json(output).targets) {
    assert.deepEqual(target.testCases[0], passed);
    assert.equal(target.testCases[1].id, "framework.typescript-runner");
    assert.equal(target.testCases[1].status, "failed");
  }
}));

test("standalone language matrices collect raw fixtures and clean up their target snapshots", () => temporaryDirectory("compat-standalone-", (directory) => {
  const mock = join(directory, "fetch.mjs"), executor = join(directory, "executor.mjs"), observed = join(directory, "paths");
  write(mock, `globalThis.fetch = async url => Response.json(url.endsWith('/swagger/api/swagger.json')
    ? { components: { schemas: { Example: { type: 'object', properties: { name: { type: 'string' } } } } } }
    : url.endsWith('/sample-json/outputs') ? [{ providerId: 'example', hasPublicSdkModel: true, sdkModelName: 'Example' }]
    : { name: 'Ada', legacyAlias: 'kept' });`);
  write(executor, `import assert from 'node:assert/strict'; import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
    const path = process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH;
    assert.equal(JSON.parse(readFileSync(path)).fixtures[0].output.legacyAlias, 'kept');
    appendFileSync(process.env.TEST_PATHS, path + '\\n');
    writeFileSync(process.env.SDK_COMPATIBILITY_RESULT_FILE, JSON.stringify({schemaVersion: 1, testCases: [${JSON.stringify(passed)}]}));`);
  succeeded(run(process.execPath, [join(scripts, "run-matrix.mjs"), "ruby", process.execPath, executor], { env: {
    ...configuration, NODE_OPTIONS: `--import=${mock}`, TEST_PATHS: observed,
    SDK_COMPATIBILITY_CURRENT_PACKAGE: directory, SDK_COMPATIBILITY_MAIN_PACKAGE: "",
    SDK_COMPATIBILITY_PSO_FIXTURES_PATH: "", SDK_COMPATIBILITY_VALIDATE_CATALOG: "false",
    SDK_COMPATIBILITY_RESULTS_PATH: join(directory, "results.json"),
  } }));
  const paths = readFileSync(observed, "utf8").trim().split("\n");
  assert.equal(paths.length, 4);
  assert.ok(paths.every((path) => !existsSync(path)));
}));

test("current and main SDKs cannot satisfy required API coverage by skipping", () => temporaryDirectory("compat-skips-", (directory) => {
  const executor = join(directory, "executor.mjs"), cache = join(directory, "fixtures.json"), output = join(directory, "results.json");
  write(cache, JSON.stringify({ fixtures: [{ providerId: "test", hasPublicSdkModel: false }] }));
  write(executor, `import { writeFileSync } from 'node:fs'; writeFileSync(process.env.SDK_COMPATIBILITY_RESULT_FILE,
    JSON.stringify({ schemaVersion: 1, testCases: [{ id: 'api.providers.get', status: 'skipped', skipReason: 'Method missing', durationMs: 0 }] }));`);
  const result = run(process.execPath, [join(scripts, "run-matrix.mjs"), "ruby", process.execPath, executor], { env: {
    ...configuration, SDK_COMPATIBILITY_CURRENT_PACKAGE: directory, SDK_COMPATIBILITY_MAIN_PACKAGE: directory,
    SDK_COMPATIBILITY_PSO_FIXTURES_PATH: cache, SDK_COMPATIBILITY_VALIDATE_CATALOG: "false", SDK_COMPATIBILITY_RESULTS_PATH: output,
  } });
  assert.equal(result.status, 1);
  for (const target of json(output).targets) assert.equal(target.testCases[0].status, target.isCurrent ? "failed" : "skipped");
}));

test("matrix exits reflect scoped acknowledgements without a separate reporting step", () => temporaryDirectory("compat-acknowledgements-", (directory) => {
  const executor = join(directory, "executor.mjs"), cache = join(directory, "fixtures.json"), output = join(directory, "results.json");
  const acknowledgement = json(join(root, "compatibility.json")).compatibility.acknowledgements.find((entry) => entry.language === "php" && entry.testCaseId === "api.sessions.get-result");
  const entry = { ...failed, id: acknowledgement.testCaseId, failure: { name: "Error", message: acknowledgement.failureMessageIncludes.join(" ") } };
  write(cache, JSON.stringify({ fixtures: [{ providerId: "test", hasPublicSdkModel: false }] }));
  write(executor, `import { writeFileSync } from 'node:fs';
    const entry = ${JSON.stringify(entry)};
    if (process.env.SDK_IS_CURRENT === 'true' && process.env.TEST_MODE !== 'current-failure') entry.status = 'passed';
    if (process.env.TEST_MODE === 'different-failure') entry.failure.message = 'Unrelated failure';
    const testCases = [entry];
    if (process.env.TEST_MODE === 'framework-failure') testCases.push({ ...entry, id: 'framework.php-runner', status: 'failed' });
    writeFileSync(process.env.SDK_COMPATIBILITY_RESULT_FILE, JSON.stringify({ schemaVersion: 1,
      sdkVersion: process.env.SDK_COMPATIBILITY_TARGET_VERSION || '3.2.1', testCases }));`);
  const execute = (mode) => run(process.execPath, [join(scripts, "run-matrix.mjs"), "php", process.execPath, executor], { env: {
    ...configuration, TEST_MODE: mode, SDK_COMPATIBILITY_CURRENT_PACKAGE: directory, SDK_COMPATIBILITY_MAIN_PACKAGE: directory,
    SDK_COMPATIBILITY_PSO_FIXTURES_PATH: cache, SDK_COMPATIBILITY_VALIDATE_CATALOG: "false", SDK_COMPATIBILITY_RESULTS_PATH: output,
  } });
  succeeded(execute("acknowledged"));
  for (const target of json(output).targets) {
    const actual = target.testCases[0];
    assert.equal(actual.status, target.isCurrent ? "passed" : "skipped");
    if (!target.isCurrent) assert.deepEqual(actual.acknowledgedFailure, entry.failure);
  }
  for (const mode of ["current-failure", "different-failure", "framework-failure"]) assert.equal(execute(mode).status, 1, mode);
  const target = { isCurrent: false, sdkVersion: acknowledgement.sdkVersions[0] };
  assert.equal(acknowledgeFailures([entry], target, "php", [{ ...acknowledgement, failureMessageIncludes: [] }])[0].status, "failed");
}));

test("fixture cache keeps wire aliases and filters only serialization expectations", () => temporaryDirectory("compat-fixtures-", (directory) => {
  const output = join(directory, "fixtures.json");
  const schema = { type: "object", additionalProperties: false, properties: {
    name: { type: "string" }, responseOnly: { type: "string", readOnly: true },
    children: { type: "array", items: { $ref: "#/components/schemas/Child" } },
    free: { type: "object", additionalProperties: true },
    dictionary: { type: "object", additionalProperties: { $ref: "#/components/schemas/Child" } },
  } };
  const swagger = { components: { schemas: { Example: schema, Child: { type: "object", additionalProperties: false, properties: { name: { type: "string" } } } } } };
  const payload = { name: "Jane", responseOnly: "server", ignoredAlias: "remove", children: [{ name: "child", alias: "remove" }], free: { any: { nested: true } }, dictionary: { key: { name: "value", alias: "remove" } } };
  const mock = join(directory, "mock.mjs");
  write(mock, `globalThis.fetch = async url => Response.json(url.endsWith('/swagger/api/swagger.json') ? ${JSON.stringify(swagger)} : url.endsWith('/sample-json/outputs') ? [{providerId: 'example', sdkModelName: 'Example', hasPublicSdkModel: true}] : ${JSON.stringify(payload)});`);
  succeeded(run(process.execPath, ["--import", mock, join(scripts, "fetch-pso-fixtures.mjs")], { env: { ...configuration, SDK_COMPATIBILITY_PSO_FIXTURES_PATH: output } }));
  const fixture = json(output).fixtures[0];
  const expected = { name: "Jane", children: [{ name: "child" }], free: payload.free, dictionary: { key: { name: "value" } } };
  assert.deepEqual(fixture.output, payload);
  const { responseOnly, ...legacy } = payload;
  assert.deepEqual(fixture.legacySerializationOutput, legacy);
  assert.deepEqual(fixture.serializationOutput, expected);
}));

test("default build wrappers reach the generator with empty argument arrays on Bash 3.2", () => temporaryDirectory("compat-bash-", (directory) => {
  const log = join(directory, "arguments");
  write(join(directory, "helpers/generate-client.sh"), '#!/bin/bash\nprintf "%s\\n" "$@" > "$GENERATOR_LOG"\nexit 72\n', true);
  for (const language of ["typescript", "php", "ruby"]) {
    const wrapper = join(directory, `api-${language}/build-sdk.sh`);
    mkdirSync(dirname(wrapper), { recursive: true });
    copyFileSync(join(root, `api-${language}/build-sdk.sh`), wrapper);
    for (const args of [[], ["--swagger-file-or-url", "spec with spaces.json"]]) {
      const result = run("/bin/bash", [wrapper, ...args], { env: { GENERATOR_LOG: log } });
      assert.equal(result.status, 72, result.stderr);
      const actual = readFileSync(log, "utf8");
      assert.match(actual, /--language/);
      assert.equal(actual.includes("spec with spaces.json"), args.length > 0);
    }
  }
}));

test("generator config is selected from its repository regardless of the entry directory", () => temporaryDirectory("compat-config-", (directory) => {

  mkdirSync(join(directory, "helpers"));
  copyFileSync(join(root, "helpers/generate-client.sh"), join(directory, "helpers/generate-client.sh"));
  copyFileSync(join(root, "helpers/inject-sdk-header.mjs"), join(directory, "helpers/inject-sdk-header.mjs"));
  write(join(directory, "helpers/common.sh"), 'get_version() { printf "3.2.1"; }\n');
  write(join(directory, "openapitools.json"), '{}');
  write(join(directory, "api-typescript/tests/openapitools.json"), '{"generator-cli":{"version":"incorrect"}}');
  write(join(directory, "swagger.json"), '{}');
  write(join(directory, "bin/npx"), `#!/bin/bash
printf '%s\\n' "$@" > "$GENERATOR_LOG"
while [[ $# -gt 0 ]]; do
  if [[ "$1" == "-o" ]]; then
    mkdir -p "$2/src"
    printf '        let response: Response | undefined = undefined;\\n' > "$2/src/runtime.ts"
    break
  fi
  shift
done
`, true);
  const log = join(directory, "arguments");
  for (const cwd of [directory, join(directory, "api-typescript/tests")]) {
    succeeded(run("/bin/bash", [join(directory, "helpers/generate-client.sh"), "--language", "typescript-fetch", "--output-folder", join(directory, "output"), "--swagger-file-or-url", join(directory, "swagger.json")], { cwd, env: { PATH: `${directory}/bin:${process.env.PATH}`, GENERATOR_LOG: log } }));
    const args = readFileSync(log, "utf8").trim().split("\n");
    assert.equal(resolve(args[args.indexOf("--openapitools") + 1]), join(directory, "openapitools.json"));
    assert.match(readFileSync(join(directory, "output/src/runtime.ts"), "utf8"), /X-Trinsic-SDK.*typescript\/3\.2\.1/);
  }
}));

test("C# keeps the httpclient generator and supports both schema overrides", () => temporaryDirectory("compat-csharp-build-", (directory) => {
  const wrapper = join(directory, "api-csharp/build-sdk.sh");
  mkdirSync(dirname(wrapper), { recursive: true });
  copyFileSync(join(root, "api-csharp/build-sdk.sh"), wrapper);
  write(join(directory, "helpers/common.sh"), '');
  write(join(directory, "helpers/generate-client.sh"), '#!/bin/bash\nprintf "%s\\n" "$@" > "$GENERATOR_LOG"\nexit 72\n', true);
  const log = join(directory, "arguments");
  for (const [args, schema, expected] of [
    [[], "", "https://api.trinsic.id/swagger/api/swagger.json"],
    [[], "environment spec.json", "environment spec.json"],
    [["--swagger-file-or-url", "argument spec.json"], "environment spec.json", "argument spec.json"],
  ]) {
    const result = run("/bin/bash", [wrapper, ...args], { env: { TRINSIC_OPENAPI_SCHEMA: schema, GENERATOR_LOG: log } });
    assert.equal(result.status, 72, result.stderr);
    const actual = readFileSync(log, "utf8").trim().split("\n");
    assert.ok(actual.includes("library=httpclient"));
    assert.equal(actual[actual.indexOf("--swagger-file-or-url") + 1], expected);
  }
}));

test("baseline retains its generation options, helper, post-processing, and configuration directory", () => temporaryDirectory("compat-baseline-", (directory) => {
  const helper = join(directory, "helpers/generate-client.sh");
  const wrapper = join(directory, "api-php/build-sdk.sh");
  write(helper, `#!/bin/bash
set -euo pipefail
printf '%s\\n' "$PWD" "$@" > "$BASELINE_LOG"
exit "\${BASELINE_EXIT:-0}"
`, true);
  write(wrapper, `#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/../helpers/generate-client.sh" --language php --additional-property baseline-only --swagger-file-or-url old-spec
printf 'baseline post-processing' > "$BASELINE_POSTPROCESS"
`, true);
  const helperBefore = readFileSync(helper, "utf8"), wrapperBefore = readFileSync(wrapper, "utf8");
  const log = join(directory, "log"), postprocess = join(directory, "postprocess");
  for (const code of [0, 42]) {
    const result = run("/bin/bash", [join(scripts, "build-baseline.sh"), directory, "php", "target spec.json"], { env: { BASELINE_LOG: log, BASELINE_POSTPROCESS: postprocess, BASELINE_EXIT: String(code) } });
    assert.equal(result.status, code, result.stderr);
    assert.deepEqual(readFileSync(log, "utf8").trim().split("\n"), [directory, "--language", "php", "--additional-property", "baseline-only", "--swagger-file-or-url", "old-spec", "--swagger-file-or-url", "target spec.json"]);
    assert.equal(readFileSync(helper, "utf8"), helperBefore);
    assert.equal(readFileSync(wrapper, "utf8"), wrapperBefore);
  }
  assert.equal(readFileSync(postprocess, "utf8"), "baseline post-processing");
}));

test("sequential aggregate runs work without background process IDs", () => temporaryDirectory("compat-sequential-", (directory) => {
  const script = join(directory, "scripts/sdk-compatibility/run.sh");
  mkdirSync(dirname(script), { recursive: true });
  copyFileSync(join(scripts, "run.sh"), script);
  write(join(directory, "scripts/sdk-compatibility/fetch-pso-fixtures.mjs"), 'import { writeFileSync } from "node:fs"; writeFileSync(process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH, "{}");');
  write(join(directory, "api-example/tests/run-compatibility.sh"), '#!/bin/bash\nprintf "{}" > "$SDK_COMPATIBILITY_RESULTS_PATH"\n');
  const results = join(directory, "results");
  succeeded(run("/bin/bash", [script], { env: { SDK_COMPATIBILITY_PARALLEL: "false", SDK_COMPATIBILITY_RESULTS_DIR: results } }));
  assert.equal(readFileSync(join(results, "suite-status.tsv"), "utf8"), "example\t0\n");
  assert.ok(existsSync(join(results, "example/compatibility.json")));
}));

test("aggregate reruns cannot reuse stale reports after startup failure", () => temporaryDirectory("compat-rerun-", (directory) => {
  const script = join(directory, "scripts/sdk-compatibility/run.sh");
  mkdirSync(dirname(script), { recursive: true });
  copyFileSync(join(scripts, "run.sh"), script);
  write(join(dirname(script), "fetch-pso-fixtures.mjs"), 'import { writeFileSync } from "node:fs"; writeFileSync(process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH, "{}");');
  const old = { schemaVersion: 1, suite: { language: "csharp" }, targets: [{ isCurrent: true, testCases: [passed] }] };
  const stale = join(directory, "old.json"); write(stale, JSON.stringify(old));
  write(join(directory, "api-csharp/tests/run-compatibility.sh"), '#!/bin/bash\nif [[ "$TEST_STARTUP_FAILURE" == "true" ]]; then exit "${TEST_EXIT:-42}"; fi\ncp "$TEST_OLD_REPORT" "$SDK_COMPATIBILITY_RESULTS_PATH"\nexit 0\n');
  const results = join(directory, "results");
  for (const parallel of ["false", "true"]) {
    const env = { SDK_COMPATIBILITY_PARALLEL: parallel, SDK_COMPATIBILITY_RESULTS_DIR: results, SDK_COMPATIBILITY_FAIL_ON_FAILURE: "true", TEST_OLD_REPORT: stale };
    succeeded(run("/bin/bash", [script], { env: { ...env, TEST_STARTUP_FAILURE: "false" } }));
    assert.equal(run("/bin/bash", [script], { env: { ...env, TEST_STARTUP_FAILURE: "true" } }).status, 1);
    assert.match(json(join(results, "csharp/compatibility.json")).targets[0].setupFailure, /code 42/);
    assert.equal(readFileSync(join(results, "suite-status.tsv"), "utf8"), "csharp\t42\n");
    assert.equal(run("/bin/bash", [script], { env: { ...env, TEST_STARTUP_FAILURE: "true", TEST_EXIT: "0" } }).status, 1, "success without a report must fail");
    succeeded(run("/bin/bash", [script], { env: { ...env, TEST_STARTUP_FAILURE: "true", SDK_COMPATIBILITY_FAIL_ON_FAILURE: "false" } }));
  }
}));

test("TypeScript-only entry point prepares raw fixtures and preserves a supplied cache", () => temporaryDirectory("compat-typescript-", (directory) => {
  const runner = join(directory, "api-typescript/tests/run-compatibility.sh");
  mkdirSync(dirname(runner), { recursive: true });
  copyFileSync(join(root, "api-typescript/tests/run-compatibility.sh"), runner);
  const helperDirectory = join(directory, "scripts/sdk-compatibility");
  mkdirSync(helperDirectory, { recursive: true });
  copyFileSync(join(scripts, "fetch-pso-fixtures.mjs"), join(helperDirectory, "fetch-pso-fixtures.mjs"));
  write(join(directory, "api-typescript/build-sdk.sh"), '#!/bin/bash\nmkdir -p "$TEST_REPO/api-typescript/sdk/publish"\ntouch "$TEST_REPO/api-typescript/sdk/publish/trinsic-api-test.tgz"\n', true);
  write(join(helperDirectory, "build-baseline.sh"), '#!/bin/bash\nmkdir -p "$1/api-typescript/sdk/publish"\ntouch "$1/api-typescript/sdk/publish/trinsic-api-test.tgz"\n');
  write(join(helperDirectory, "run-matrix.mjs"), `import { readFileSync, writeFileSync } from 'node:fs';
const path = process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH;
writeFileSync(process.env.TEST_OBSERVATION, JSON.stringify({ path, cache: JSON.parse(readFileSync(path)) }));`);
  write(join(directory, "bin/npm"), '#!/bin/bash\nexit 0\n', true);
  write(join(directory, "bin/curl"), '#!/bin/bash\nprintf "{}" > "${@: -1}"\n', true);
  write(join(directory, "bin/git"), '#!/bin/bash\nif [[ "$3 $4" == "worktree add" ]]; then mkdir -p "$6"; fi\nif [[ "$3" == "rev-parse" ]]; then printf "baseline"; fi\n', true);
  const mock = join(directory, "fetch.mjs");
  write(mock, `globalThis.fetch = async url => Response.json(url.endsWith('/swagger/api/swagger.json')
? { components: { schemas: { Example: { type: 'object', additionalProperties: false, properties: { name: { type: 'string' }, responseOnly: { type: 'string', readOnly: true } } } } } }
: url.endsWith('/sample-json/outputs') ? [{ providerId: 'example', sdkModelName: 'Example', hasPublicSdkModel: true }]
: { name: 'Jane', responseOnly: 'server', alias: 'remove' });`);
  const observation = join(directory, "observation.json");
  const env = { ...configuration, PATH: `${directory}/bin:${process.env.PATH}`, NODE_OPTIONS: `--import=${mock}`, TEST_REPO: directory, TEST_OBSERVATION: observation, SDK_COMPATIBILITY_PSO_FIXTURES_PATH: "" };
  succeeded(run("/bin/bash", [runner], { env }));
  const collected = json(observation);
  assert.deepEqual(collected.cache.fixtures[0].output, { name: "Jane", responseOnly: "server", alias: "remove" });
  assert.deepEqual(collected.cache.fixtures[0].serializationOutput, { name: "Jane" });
  assert.equal(existsSync(collected.path), false, "temporary fixture cache must be cleaned up");
  const supplied = join(directory, "supplied.json");
  write(supplied, JSON.stringify({ fixtures: [{ source: "caller" }] }));
  succeeded(run("/bin/bash", [runner], { env: { ...env, SDK_COMPATIBILITY_PSO_FIXTURES_PATH: supplied } }));
  assert.equal(json(observation).path, supplied);
  assert.deepEqual(json(supplied), { fixtures: [{ source: "caller" }] });
}));
