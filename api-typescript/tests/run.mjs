#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readProcessTestCases, SDK_VERSION, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const tests = new URL(".", import.meta.url).pathname;
const files = process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["provider-outputs"] : ["read-apis", "session-lifecycle", "recommendations", "provider-outputs"];
let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-typescript-compat-", (directory) => {
    command("npm", ["ci", "--ignore-scripts"], { cwd: tests });
    const version = JSON.parse(readFileSync(join(tests, "node_modules/@trinsic/api/package.json"))).version;
    const cases = [];
    for (const name of files) {
      const output = join(directory, `${name}.result.json`);
      const execution = command(process.execPath, ["--use-system-ca", "--import", "tsx", "--test", join(tests, "src", `${name}.test.ts`)], { cwd: tests, check: false, env: childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: version }) });
      cases.push(...readProcessTestCases(output, execution, "typescript", name));
    }
    return { sdkVersion: version, testCases: cases };
  }));
} catch (error) { testCases = failure("typescript", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
