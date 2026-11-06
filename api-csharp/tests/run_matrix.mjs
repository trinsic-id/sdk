#!/usr/bin/env node
// Single-target executor for the shared SDK compatibility matrix coordinator.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { childEnvironment, command, failure, readNativeTestCases, target, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const tests = new URL(".", import.meta.url).pathname;
const selected = target();
let result;
try {
  result = temporaryDirectory("trinsic-csharp-compat-", (directory) => {
  const source = join(directory, "runner");
  cpSync(tests, source, {
    recursive: true,
    filter: (path) => ![".results", "bin", "obj", "run_matrix.py", "run_matrix.mjs", "run-compatibility.sh", "README.md"].includes(basename(path)),
  });
  const packageSource = join(directory, "packages");
  mkdirSync(packageSource);
  const version = selected.packagePath ? packageVersion(selected.packagePath) : selected.version;
  if (!version) throw new Error("C# target omitted both package path and version.");
  const sources = ["https://api.nuget.org/v3/index.json"];
  if (selected.packagePath) {
    cpSync(selected.packagePath, join(packageSource, basename(selected.packagePath)));
    sources.unshift(packageSource);
  }
  writeFileSync(join(directory, "NuGet.Config"), `<configuration><packageSources><clear />${sources.map((value, index) => `<add key="source${index}" value="${value}" />`).join("")}</packageSources></configuration>\n`);
  const output = join(directory, "target-results.json");
  const environment = childEnvironment({ DOTNET_ROLL_FORWARD: "Major", NUGET_PACKAGES: join(directory, "nuget-global-packages"), SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: version });
  const restore = command("dotnet", ["restore", join(source, "CompatibilityRunner.csproj"), "--configfile", join(directory, "NuGet.Config"), `-p:TrinsicApiVersion=${version}`], { env: environment, check: false });
  // Detect the package's actual client architecture, including locally built
  // packages that retain a published version number.
  const assets = restore.status === 0 && JSON.parse(readFileSync(join(source, "obj/project.assets.json")));
  const sdk = assets && Object.values(assets.targets).flatMap(Object.entries).find(([name]) => name.toLowerCase() === `trinsic.api/${version}`.toLowerCase())?.[1];
  const legacy = Boolean(sdk?.dependencies?.["Microsoft.Extensions.Hosting"]);
  const execution = restore.status === 0 && command("dotnet", ["test", join(source, "CompatibilityRunner.csproj"), ...(process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["--filter", "FullyQualifiedName~ProviderOutputFixturesRoundTrip|FullyQualifiedName~HarnessRegressionTests"] : []), "--logger", "trx;LogFileName=native.trx", "--results-directory", directory, "--no-restore", `-p:TrinsicApiVersion=${version}`, `-p:LegacySdk=${legacy}`], { env: environment, check: false });
  return { sdkVersion: version, testCases: readNativeTestCases(output, execution || restore, "csharp", "trx", join(directory, "native.trx")) };
  });
} catch (error) {
  result = { testCases: failure("csharp", error instanceof Error ? error.message : String(error)) };
}
writeExecutorResult(result);
function packageVersion(path) {
  const match = basename(path).match(/^Trinsic\.Api\.(.+)\.nupkg$/);
  if (!match) throw new Error(`Unexpected C# package name: ${basename(path)}.`);
  return match[1];
}
