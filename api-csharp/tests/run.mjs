#!/usr/bin/env node
// Install the pinned release and retain native xUnit failures in the JSON output.
import { cpSync } from "node:fs";
import { basename, join } from "node:path";
import { childEnvironment, command, failure, readNativeTestCases, SDK_VERSION, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const tests = new URL(".", import.meta.url).pathname;
let result;
try {
  result = temporaryDirectory("trinsic-csharp-compat-", (directory) => {
  const source = join(directory, "runner");
  cpSync(tests, source, {
    recursive: true,
    filter: (path) => ![".results", "bin", "obj", "run.mjs", "README.md"].includes(basename(path)),
  });
  const output = join(directory, "target-results.json");
  const environment = childEnvironment({ DOTNET_ROLL_FORWARD: "Major", NUGET_PACKAGES: join(directory, "nuget-global-packages"), SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION });
  const execution = command("dotnet", ["test", join(source, "CompatibilityRunner.csproj"), ...(process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["--filter", "FullyQualifiedName~ProviderOutputFixturesRoundTrip|FullyQualifiedName~HarnessRegressionTests"] : []), "--logger", "trx;LogFileName=native.trx", "--results-directory", directory], { env: environment, check: false });
  return { sdkVersion: SDK_VERSION, testCases: readNativeTestCases(output, execution, "csharp", "trx", join(directory, "native.trx")) };
  });
} catch (error) {
  result = { testCases: failure("csharp", error instanceof Error ? error.message : String(error)) };
}
writeExecutorResult(result);
