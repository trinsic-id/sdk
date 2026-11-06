#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readNativeTestCases, SDK_VERSION, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const tests = new URL(".", import.meta.url).pathname;
const files = process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["provider-outputs", "harness", "required-fields"] : ["read-apis", "session-lifecycle", "recommendations", "provider-outputs", "harness", "required-fields"];
let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-typescript-compat-", (directory) => {
    command("npm", ["ci", "--ignore-scripts"], { cwd: tests });
    const version = JSON.parse(readFileSync(join(tests, "node_modules/@trinsic/api/package.json"))).version;
    const cases = [];
    for (const name of files) {
      const output = join(directory, `${name}.result.json`);
      const native = join(directory, `${name}.xml`);
      const execution = command(process.execPath, ["--use-system-ca", "--import", "tsx", "--test", "--test-reporter=spec", "--test-reporter-destination=stdout", "--test-reporter=junit", `--test-reporter-destination=${native}`, join(tests, "src", `${name}.test.ts`)], { cwd: tests, check: false, env: childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: version }) });
      cases.push(...readNativeTestCases(output, execution, "typescript", "node", native));
    }
    return { sdkVersion: version, testCases: cases };
  }));
} catch (error) { testCases = failure("typescript", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
