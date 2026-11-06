#!/usr/bin/env node
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readNativeTestCases, SDK_VERSION, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const tests = new URL(".", import.meta.url).pathname;
const moduleName = "github.com/trinsic-id/sdk-go-api/v3";
let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-go-compat-", (directory) => {
    command("go", ["mod", "init", "trinsic-sdk-compatibility-target"], { cwd: directory });
    command("go", ["get", `${moduleName}@v${SDK_VERSION}`], { cwd: directory });
    const packageDirectory = command("go", ["list", "-f", "{{.Dir}}", moduleName], { cwd: directory }).stdout.trim();
    const version = command("go", ["list", "-m", "-f", "{{.Version}}", moduleName], { cwd: directory }).stdout.trim().replace(/^v/, "");
    cpSync(join(tests, "CompatibilitySupport.go"), join(directory, "CompatibilitySupport.go"));
    cpSync(join(tests, "compatibility_test.go"), join(directory, "compatibility_test.go"));
    writeFileSync(join(directory, "pso_models_gen.go"), providerOutputRegistry(packageDirectory));
    command("go", ["mod", "tidy"], { cwd: directory });
    const output = join(directory, "target-results.json");
    const execution = command("go", ["test", "-json", "-count=1", ...(process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["-run", "TestProviderOutputs|TestHarness"] : []), "."], { cwd: directory, check: false, env: childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: version }) });
    const native = join(directory, "native.jsonl");
    writeFileSync(native, execution.stdout ?? "");
    return { sdkVersion: version, testCases: readNativeTestCases(output, execution, "go", "go", native) };
  }));
} catch (error) { testCases = failure("go", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });

function providerOutputRegistry(packageDirectory) {
  const fixtureCache = process.env.SDK_COMPATIBILITY_PSO_FIXTURES_PATH;
  const fixtures = fixtureCache && existsSync(fixtureCache) ? JSON.parse(readFileSync(fixtureCache)).fixtures ?? [] : [];
  const wanted = new Set(fixtures.filter((fixture) => fixture.hasPublicSdkModel && fixture.sdkModelName).map((fixture) => fixture.sdkModelName));
  const available = new Set();
  for (const file of readdirSync(packageDirectory).filter((file) => file.endsWith(".go"))) for (const match of readFileSync(join(packageDirectory, file), "utf8").matchAll(/^type\s+([A-Za-z0-9_]+)\s+struct/gm)) available.add(match[1]);
  const entries = [...wanted].filter((name) => available.has(name)).sort().map((name) => `\t${JSON.stringify(name)}: func() any { return &trinsic_api.${name}{} },`).join("\n");
  return entries ? `package main\n\nimport trinsic_api "${moduleName}"\n\nvar providerOutputFactories = map[string]func() any{\n${entries}\n}\n` : "package main\n\nvar providerOutputFactories = map[string]func() any{}\n";
}
