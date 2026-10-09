import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const tests = dirname(new URL(import.meta.url).pathname);
const root = join(tests, "../..");
const moduleName = "github.com/trinsic-id/sdk-go-api/v3";
const config = Object.fromEntries(["TRINSIC_TEST_BASE_URL", "TRINSIC_TEST_ACCESS_TOKEN", "TRINSIC_TEST_VERIFICATION_PROFILE_ID"].map((name) => [name, required(name)]));
const matrix = JSON.parse(readFileSync(join(root, "compatibility.json")));
const catalog = JSON.parse(readFileSync(join(root, "compatibility-tests.json"))).testCases;
const versions = matrix.compatibility.sdkVersions.go;
const targets = [
  { label: "current branch", packagePath: required("SDK_GO_CURRENT_PACKAGE"), isCurrent: true },
  { label: `origin/main (${required("SDK_ORIGIN_MAIN_REVISION")})`, packagePath: required("SDK_GO_MAIN_PACKAGE"), isCurrent: true },
  ...[...versions].reverse().map((version) => ({ label: `${moduleName}@v${version}`, version, isCurrent: false })),
];

const results = targets.map(runTarget);
const expected = catalog.filter((testCase) => testCase.requiredLanguages?.includes("go")).map((testCase) => testCase.id);
for (const target of results) {
  const actual = new Set(target.testCases.map((testCase) => testCase.id));
  const missing = expected.filter((id) => !actual.has(id));
  if (missing.length) target.testCases.push(failure("framework.catalog-coverage", "CoverageError", `Missing required Go test cases: ${missing.join(", ")}.`));
}
const report = {
  $schema: "https://trinsic.id/schemas/sdk-compatibility-results-v1.json",
  schemaVersion: 1,
  run: { generatedAt: new Date().toISOString(), targetBaseUrl: config.TRINSIC_TEST_BASE_URL.replace(/\/$/, "") },
  suite: { language: "go" },
  testCatalog: catalog,
  targets: results,
};
const coverage = apiCoverage(catalog);
if (coverage) report.apiCoverage = coverage;
const output = process.env.SDK_COMPATIBILITY_RESULTS_PATH ?? join(tests, ".results", "compatibility.json");
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Structured compatibility results: ${output}`);
process.exitCode = results.some((target) => target.setupFailure || target.testCases.some((testCase) => testCase.status === "failed")) ? 1 : 0;

function runTarget(target) {
  const directory = mkdtempSync(join(tmpdir(), "trinsic-go-compat-"));
  const result = { label: target.label, isCurrent: target.isCurrent, testCases: [] };
  try {
    command("go", ["mod", "init", "trinsic-sdk-compatibility-target"], directory);
    if (target.packagePath) {
      command("go", ["mod", "edit", `-require=${moduleName}@v3.2.1`], directory);
      command("go", ["mod", "edit", `-replace=${moduleName}=${target.packagePath}`], directory);
    }
    else command("go", ["get", `${moduleName}@v${target.version}`], directory);
    const packageDirectory = command("go", ["list", "-f", "{{.Dir}}", moduleName], directory).trim();
    result.sdkVersion = target.version ?? "3.2.1";
    cpSync(join(tests, "run_target.go"), join(directory, "run_target.go"));
    writeFileSync(join(directory, "pso_models_gen.go"), providerOutputRegistry(packageDirectory));
    command("go", ["mod", "tidy"], directory);
    const targetResult = join(directory, "target-results.json");
    const execution = spawnSync("go", ["run", "."], {
      cwd: directory,
      encoding: "utf8",
      env: { ...process.env, ...config, SDK_COMPATIBILITY_RESULT_FILE: targetResult, SDK_IS_CURRENT: String(target.isCurrent), SDK_TARGET_LABEL: target.label },
    });
    if (execution.stdout) process.stdout.write(execution.stdout);
    if (execution.stderr) process.stderr.write(execution.stderr);
    if (existsSync(targetResult)) result.testCases = JSON.parse(readFileSync(targetResult)).testCases;
    else result.testCases = [failure("framework.go-runner", "TestRunnerError", `Go target exited with code ${execution.status ?? "unknown"} before producing structured results.`)];
  } catch (error) {
    result.setupFailure = error.message;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
  return result;
}

function providerOutputRegistry(packageDirectory) {
  const fixtureCache = process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH;
  const fixtures = fixtureCache && existsSync(fixtureCache) ? JSON.parse(readFileSync(fixtureCache)).fixtures ?? [] : [];
  const wanted = new Set(fixtures.filter((fixture) => fixture.hasPublicSdkModel && fixture.sdkModelName).map((fixture) => fixture.sdkModelName));
  const available = new Set();
  for (const file of readdirSync(packageDirectory).filter((file) => file.endsWith(".go"))) {
    const source = readFileSync(join(packageDirectory, file), "utf8");
    for (const match of source.matchAll(/^type\s+([A-Za-z0-9_]+)\s+struct/gm)) available.add(match[1]);
  }
  const entries = [...wanted].filter((name) => available.has(name)).sort().map((name) => `\t${JSON.stringify(name)}: func() any { return &trinsic_api.${name}{} },`).join("\n");
  if (!entries) return "package main\n\nvar providerOutputFactories = map[string]func() any{}\n";
  return `package main\n\nimport trinsic_api "${moduleName}"\n\nvar providerOutputFactories = map[string]func() any{\n${entries}\n}\n`;
}

function apiCoverage(cases) {
  const specPath = process.env.SDK_COMPATIBILITY_OPENAPI_SPEC;
  if (!specPath || !existsSync(specPath)) return undefined;
  const spec = JSON.parse(readFileSync(specPath));
  const caseMap = new Map();
  for (const testCase of cases.filter((testCase) => testCase.kind === "api-operation" && testCase.operationId)) caseMap.set(testCase.operationId, [...(caseMap.get(testCase.operationId) ?? []), testCase.id]);
  const operations = [];
  const operationIds = new Set();
  for (const [path, item] of Object.entries(spec.paths ?? {})) for (const [method, operation] of Object.entries(item ?? {})) {
    if (!["delete", "get", "head", "options", "patch", "post", "put"].includes(method.toLowerCase()) || !operation?.operationId) continue;
    operationIds.add(operation.operationId);
    const testCaseIds = caseMap.get(operation.operationId) ?? [];
    operations.push({ covered: testCaseIds.length > 0, method: method.toUpperCase(), operationId: operation.operationId, path, testCaseIds });
  }
  operations.sort((left, right) => left.path.localeCompare(right.path) || left.method.localeCompare(right.method));
  return { covered: operations.filter((operation) => operation.covered).length, total: operations.length, operations, unmappedTestCaseIds: cases.filter((testCase) => testCase.kind === "api-operation" && !operationIds.has(testCase.operationId)).map((testCase) => testCase.id) };
}

function command(executable, commandArguments, cwd) {
  const output = spawnSync(executable, commandArguments, { cwd, encoding: "utf8" });
  if (output.status !== 0) throw new Error(`${executable} ${commandArguments.join(" ")} failed: ${output.stderr || output.stdout}`);
  return output.stdout;
}
function failure(id, name, message) { return { id, status: "failed", durationMs: 0, failure: { name, message } }; }
function required(name) { if (!process.env[name]) throw new Error(`${name} is required`); return process.env[name]; }
