import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { readProcessTestCases, temporaryDirectory } from "./executor-helpers.mjs";

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
    assert.match(cases[1].failure.message, /without recording a failure/);
  }
  write(output, JSON.stringify({ schemaVersion: 1, testCases: [failed] }));
  assert.deepEqual(readProcessTestCases(output, { status: 1 }, "test"), [failed]);
  write(output, "invalid JSON");
  assert.equal(readProcessTestCases(output, { status: 0 }, "test")[0].status, "failed");
  assert.equal(readProcessTestCases(join(directory, "missing"), { status: 1 }, "test")[0].status, "failed");
}));

test("matrix coordinator rejects a successful report from a failed executor", () => temporaryDirectory("compat-matrix-", (directory) => {
  const executor = join(directory, "executor.mjs");
  write(executor, `import { writeFileSync } from 'node:fs';
writeFileSync(process.env.SDK_COMPATIBILITY_RESULT_FILE, JSON.stringify({ schemaVersion: 1, testCases: [${JSON.stringify(passed)}] }));
process.exitCode = 1;`);
  const output = join(directory, "matrix.json");
  const result = run(process.execPath, [join(scripts, "run-matrix.mjs"), "typescript", process.execPath, executor], {
    env: { ...configuration, SDK_COMPATIBILITY_CURRENT_PACKAGE: directory, SDK_COMPATIBILITY_MAIN_PACKAGE: directory, SDK_COMPATIBILITY_RESULTS_PATH: output, SDK_COMPATIBILITY_VALIDATE_CATALOG: "false" },
  });
  assert.equal(result.status, 1, result.stderr);
  for (const target of json(output).targets) {
    assert.deepEqual(target.testCases[0], passed);
    assert.equal(target.testCases[1].id, "framework.typescript-runner");
    assert.equal(target.testCases[1].status, "failed");
  }
}));

test("acknowledgements apply only to published targets and cannot hide unrecorded suite failures", () => temporaryDirectory("compat-render-", (directory) => {
  const status = join(directory, "suite-status.tsv");
  const report = join(directory, "php/compatibility.json");
  const render = () => run(process.execPath, [join(scripts, "render-results.mjs"), "--results-dir", directory, "--status-file", status, "--check"]);
  const acknowledgement = json(join(root, "compatibility.json")).compatibility.acknowledgements.find((entry) => entry.language === "php" && entry.testCaseId === "api.sessions.get-result");
  assert.ok(acknowledgement);
  const target = { sdkVersion: acknowledgement.sdkVersion, testCases: [{ ...failed, id: acknowledgement.testCaseId }] };
  const envelope = { schemaVersion: 1, suite: { language: "php" }, targets: [] };
  write(status, "php\t1\n");
  write(report, JSON.stringify({ ...envelope, targets: [{ ...target, isCurrent: false, label: "published" }] }));
  succeeded(render());
  assert.equal(json(join(directory, "summary.json")).totals.skipped, 1);
  write(report, JSON.stringify({ ...envelope, targets: [
    { ...target, isCurrent: false, label: "published" },
    { ...target, isCurrent: true, label: "current branch" },
    { ...target, isCurrent: true, label: "origin/main" },
  ] }));
  assert.equal(render().status, 1);
  assert.equal(json(join(directory, "summary.json")).totals.failed, 2);
  write(report, JSON.stringify({ ...envelope, targets: [{ ...target, isCurrent: true, testCases: [passed] }] }));
  assert.equal(render().status, 1);
  assert.match(json(join(directory, "summary.json")).suites[0].error, /without recording a failure/);
}));

test("fixture cache removes forbidden and read-only fields while retaining dictionaries", () => temporaryDirectory("compat-fixtures-", (directory) => {
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
  assert.deepEqual(fixture.output, { ...expected, responseOnly: "server" });
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
  // Match Node's canonical module path for the header injector's CLI entry point.
  directory = realpathSync(directory);
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
  write(join(directory, "scripts/sdk-compatibility/render-results.mjs"), '');
  write(join(directory, "api-example/tests/run-compatibility.sh"), '#!/bin/bash\nprintf "{}" > "$SDK_COMPATIBILITY_RESULTS_PATH"\n');
  const results = join(directory, "results");
  succeeded(run("/bin/bash", [script], { env: { SDK_COMPATIBILITY_PARALLEL: "false", SDK_COMPATIBILITY_RESULTS_DIR: results } }));
  assert.equal(readFileSync(join(results, "suite-status.tsv"), "utf8"), "example\t0\n");
  assert.ok(existsSync(join(results, "example/compatibility.json")));
}));

test("TypeScript-only entry point prepares filtered fixtures and preserves a supplied cache", () => temporaryDirectory("compat-typescript-", (directory) => {
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
  assert.deepEqual(collected.cache.fixtures[0].output, { name: "Jane", responseOnly: "server" });
  assert.deepEqual(collected.cache.fixtures[0].serializationOutput, { name: "Jane" });
  assert.equal(existsSync(collected.path), false, "temporary fixture cache must be cleaned up");
  const supplied = join(directory, "supplied.json");
  write(supplied, JSON.stringify({ fixtures: [{ source: "caller" }] }));
  succeeded(run("/bin/bash", [runner], { env: { ...env, SDK_COMPATIBILITY_PSO_FIXTURES_PATH: supplied } }));
  assert.equal(json(observation).path, supplied);
  assert.deepEqual(json(supplied), { fixtures: [{ source: "caller" }] });
}));
