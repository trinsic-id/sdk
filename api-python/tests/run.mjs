#!/usr/bin/env node
import { join } from "node:path";
import { childEnvironment, command, failure, readNativeTestCases, SDK_VERSION, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-python-compat-", (directory) => {
    command("python3", ["-m", "venv", directory]);
    const python = join(directory, "bin", "python");
    const packageSpecifier = `trinsic-api==${SDK_VERSION}`;
    command(python, ["-m", "pip", "install", "--disable-pip-version-check", "--quiet", packageSpecifier, "pytest"]);
    const version = command(python, ["-c", "from importlib.metadata import version; print(version('trinsic-api'))"]).stdout.trim();
    const output = join(directory, "target-results.json");
    const native = join(directory, "native.xml");
    const tests = new URL(".", import.meta.url).pathname;
    const execution = command(python, ["-m", "pytest", "-q", "--rootdir", tests, "--junitxml", native, ...(process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["-k", "provider_output"] : []), join(tests, "test_compatibility.py"), join(tests, "test_harness.py")], { check: false, env: childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: version }) });
    return { sdkVersion: version, testCases: readNativeTestCases(output, execution, "python", "junit", native) };
  }));
} catch (error) { testCases = failure("python", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
