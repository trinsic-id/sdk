import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { readNativeTestCases, readProcessTestCases, temporaryDirectory } from "./executor-helpers.mjs";
import { prepareFixtures, validateWireAliases } from "./fixtures.mjs";

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

test("3.2.0 binds the original itsme model without changing wire payloads", () => {
  const output = { firstName: "Ada", extra: "keep" };
  const prepared = prepareFixtures({ fixtures: [
    { providerId: "a-itsme-login", sdkModelName: "ItsmeLoginProviderOutput", hasPublicSdkModel: true, output },
    { providerId: "itsme", sdkModelName: "ItsmeProviderOutput", hasPublicSdkModel: true, output: {} },
  ] });
  assert.equal(prepared.fixtures[0].sdkModelName, "ItsmeProviderOutput");
  assert.equal(prepared.fixtures[0].output, output);
  assert.match(prepared.fixtures[1].unavailableModel, /predates the direct itsme/);
  assert.equal(prepared.fixtures.filter(fixture => fixture.testCaseId).length, 3);
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

test("native reports preserve unrecorded harness failures beside SDK failures", () => temporaryDirectory("compat-native-", (directory) => {
  for (const language of ["csharp", "java"]) {
    const nativeTest = "CompatibilityTest.providerOutputs";
    const output = join(directory, `${language}-target.json`);
    const entry = { ...failed, nativeTest };
    write(output, JSON.stringify({ schemaVersion: 1, testCases: [entry] }));
    const nativePath = language === "csharp" ? join(directory, "native.trx") : join(directory, "surefire");
    const nativeReport = language === "csharp" ? nativePath : join(nativePath, "TEST-example.xml");
    const writeNative = (extra) => write(nativeReport, language === "csharp"
      ? `<TestRun xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010"><TestDefinitions><UnitTest id="1"><TestMethod className="CompatibilityTest" name="providerOutputs" /></UnitTest><UnitTest id="2"><TestMethod className="HarnessRegressionTests" name="regression" /></UnitTest></TestDefinitions><Results><UnitTestResult testId="1" testName="providerOutputs" outcome="Failed" />${extra ? '<UnitTestResult testId="2" testName="regression" outcome="Failed"><Output><ErrorInfo><Message>independent failure &amp; details</Message></ErrorInfo></Output></UnitTestResult>' : ''}</Results></TestRun>`
      : `<testsuite><testcase classname="CompatibilityTest" name="providerOutputs"><failure message="expected enum failure" /></testcase>${extra ? '<testcase classname="HarnessRegressionTests" name="regression"><error message="independent failure &amp; details" /></testcase>' : ''}</testsuite>`);
    const read = () => readNativeTestCases(output, { status: 1 }, language, language === "csharp" ? "trx" : "junit", nativePath);
    writeNative(false);
    assert.equal(read().length, 1);
    writeNative(true);
    const cases = read();
    assert.equal(cases.length, 2);
    assert.match(cases[1].failure.message, /HarnessRegressionTests.regression: independent failure & details/);
    assert.equal(cases.filter((entry) => entry.status === "failed").length, 2, "both SDK and unrecorded native failures must survive");
    write(nativeReport, "truncated XML");
    assert.ok(read().some((entry) => entry.status === "failed"), "incomplete native reports must fail closed");
  }
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

test("startup failures replace an earlier report rather than reusing it", () => temporaryDirectory("compat-stale-", directory => {
  const output = join(directory, "compatibility.json");
  write(output, JSON.stringify({ old: true }));
  const execution = run(process.execPath, [join(scripts, "run.mjs"), "typescript"], {
    env: { SDK_COMPATIBILITY_RESULTS_DIR: directory, TRINSIC_TEST_BASE_URL: "", TRINSIC_TEST_ACCESS_TOKEN: "", TRINSIC_TEST_VERIFICATION_PROFILE_ID: "" },
  });
  assert.equal(execution.status, 1);
  const report = json(output);
  assert.equal(report.schemaVersion, 2);
  assert.equal(report.sdkVersion, "3.2.0");
  assert.equal(report.suites[0].testCases[0].status, "failed");
  assert.match(report.suites[0].testCases[0].id, /^framework\./);
}));
