#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readTestCases, target, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const tests = new URL(".", import.meta.url).pathname;
const selected = target();
const files = ["read-apis", "session-lifecycle", "recommendations", "provider-outputs"];
let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-typescript-compat-", (directory) => {
    writeFileSync(join(directory, "package.json"), `${JSON.stringify({ name: "trinsic-api-compat-install", private: true })}\n`);
    const packageSpecifier = selected.packagePath || `@trinsic/api@${selected.version}`;
    command("npm", ["install", "--ignore-scripts", "--no-package-lock", "--no-save", packageSpecifier], { cwd: directory });
    const version = JSON.parse(readFileSync(join(directory, "node_modules/@trinsic/api/package.json"))).version;
    const cases = [];
    for (const name of files) {
      const output = join(directory, `${name}.result.json`);
      command(process.execPath, ["--use-system-ca", "--import", "tsx", "--test", join(tests, "src", `${name}.test.ts`)], { cwd: tests, check: false, env: childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_INSTALL_ROOT: directory, SDK_VERSION: version }) });
      cases.push(...(readTestCases(output) ?? failure("typescript", `${name} exited before producing structured results.`)));
    }
    return { sdkVersion: version, testCases: cases };
  }));
} catch (error) { testCases = failure("typescript", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
