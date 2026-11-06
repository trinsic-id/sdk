#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readProcessTestCases, target, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const selected = target();
let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-python-compat-", (directory) => {
    command("python3", ["-m", "venv", directory]);
    const python = join(directory, "bin", "python");
    const packageSpecifier = selected.packagePath || `trinsic-api==${selected.version}`;
    command(python, ["-m", "pip", "install", "--disable-pip-version-check", "--quiet", packageSpecifier, "pytest"]);
    const version = command(python, ["-c", "from importlib.metadata import version; print(version('trinsic-api'))"]).stdout.trim();
    const output = join(directory, "target-results.json");
    const execution = command(python, ["-m", "pytest", "-q", ...(process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["-k", "provider_output"] : []), join(new URL(".", import.meta.url).pathname, "test_compatibility.py")], { check: false, env: childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: version }) });
    return { sdkVersion: version, testCases: readProcessTestCases(output, execution, "python") };
  }));
} catch (error) { testCases = failure("python", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
