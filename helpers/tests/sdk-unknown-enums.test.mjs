import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

// Each probe reads responses holding enum values the built SDK does not know,
// as happens when the API adds a value after an SDK version was released.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const probes = join(root, "helpers/tests/probes");
const options = language => ({
  skip: process.env.SDK_LANGUAGE && process.env.SDK_LANGUAGE !== language, timeout: 240_000,
});

async function run(command, args, spawnOptions = {}) {
  const child = spawn(command, args, {
    cwd: root, env: { ...process.env, DOTNET_ROLL_FORWARD: "LatestMajor" },
    ...spawnOptions, stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", data => { output += data; });
  child.stderr.on("data", data => { output += data; });
  const timer = setTimeout(() => child.kill("SIGKILL"), 180_000);
  try {
    const [code, signal] = await once(child, "close");
    assert.equal(signal, null, `${command} terminated: ${signal}\n${output}`);
    assert.equal(code, 0, `${command} ${args.join(" ")} failed:\n${output}`);
    return output;
  } finally { clearTimeout(timer); }
}

async function temporaryDirectory(t) {
  await mkdir(join(root, ".context"), { recursive: true });
  const directory = await mkdtemp(join(root, ".context/sdk-unknown-enums-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

// Enums declared inside a model property are validated by generated code that
// has no fallback. The API declares every enum as its own schema; fail loudly
// if that changes so the affected template gets a fallback first.
async function assertNoInlineEnums(models, marker) {
  for (const file of await readdir(models, { withFileTypes: true })) {
    if (!file.isFile()) continue;
    assert.ok(!(await readFile(join(models, file.name), "utf8")).includes(marker),
      `${file.name} validates an inline enum, which rejects unknown values`);
  }
}

test("C# reads unknown enum values as the fallback member", options("csharp"), async t => {
  const directory = await temporaryDirectory(t);
  const project = join(directory, "Probe.csproj");
  await writeFile(project, `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework></PropertyGroup><ItemGroup><ProjectReference Include="${join(root, "api-csharp/sdk/src/Trinsic.Api/Trinsic.Api.csproj")}" /></ItemGroup></Project>`);
  await writeFile(join(directory, "Program.cs"), await readFile(join(probes, "unknown_enums.cs")));
  await run("dotnet", ["run", "--project", project]);
});

test("Go reads unknown enum values as the fallback constant", options("go"), async t => {
  const directory = await temporaryDirectory(t);
  const sdk = join(root, "api-go/sdk-build");
  const module = (await readFile(join(sdk, "go.mod"), "utf8")).match(/^module (.+)$/m)[1];
  const major = module.match(/\/v(\d+)$/)?.[1] ?? "1";
  await writeFile(join(directory, "go.mod"), `module unknown-enums-probe\n\ngo 1.23\nrequire ${module} v${major}.0.0\nreplace ${module} => ${JSON.stringify(sdk)}\n`);
  const source = (await readFile(join(probes, "unknown_enums.go"), "utf8")).replace("SDK_MODULE", module);
  await writeFile(join(directory, "main.go"), source);
  await run("go", ["run", "."], { cwd: directory });
});

test("Java reads unknown enum values as the fallback constant", options("java"), async t => {
  const directory = await temporaryDirectory(t);
  const sdk = join(root, "api-java/sdk-build");
  const init = join(directory, "classpath.gradle");
  await writeFile(init, "allprojects { afterEvaluate { tasks.register('unknownEnumsClasspath') { doLast { println sourceSets.main.runtimeClasspath.asPath } } } }\n");
  const output = await run("./gradlew", ["--quiet", "--console=plain", "--init-script", init, "unknownEnumsClasspath"], { cwd: sdk });
  const classpath = output.trim().split("\n").find(line => line.includes("build/classes/java/main"));
  assert.ok(classpath, `Missing Java classpath:\n${output}`);
  await run("javac", ["-cp", classpath, "-d", directory, join(probes, "UnknownEnumsProbe.java")]);
  await run("java", ["-cp", `${directory}:${classpath}`, "UnknownEnumsProbe"]);
});

test("Python reads unknown enum values as the fallback member", options("python"), async () => {
  const sdk = join(root, "api-python/sdk");
  await assertNoInlineEnums(join(sdk, "trinsic_api/models"), "_validate_enum(");
  await run(join(sdk, ".venv/bin/python"), [join(probes, "unknown_enums.py")], {
    env: { ...process.env, PYTHONPATH: sdk },
  });
});

test("Ruby reads unknown enum values as the fallback constant", options("ruby"), async () => {
  const library = join(root, "api-ruby/sdk/lib");
  await assertNoInlineEnums(join(library, "trinsic_api/models"), "EnumAttributeValidator.new(");
  await run("ruby", ["-I", library, join(probes, "unknown_enums.rb")]);
});

test("TypeScript passes unknown enum values through unchanged", options("typescript"), async () => {
  const require = createRequire(import.meta.url);
  const sdk = require(join(root, "api-typescript/sdk/dist"));
  const step = sdk.IntegrationStepFromJSON({ method: "FutureLaunchMethod", content: "content" });
  assert.deepEqual([step.method, step.content], ["FutureLaunchMethod", "content"]);
  const session = sdk.SessionFromJSON({ id: "session-id", done: true, success: false, errorCode: "FutureErrorCode", created: 1, updated: 2 });
  assert.deepEqual([session.errorCode, session.id], ["FutureErrorCode", "session-id"]);
  const request = sdk.CreateDirectProviderSessionRequestFromJSON({
    provider: "provider", verificationProfileId: "00000000-0000-0000-0000-000000000001",
    capabilities: ["LaunchBrowser", "FutureCapability"], enableRedirectBackwardsCompatibility: false,
  });
  assert.deepEqual(request.capabilities, [sdk.IntegrationCapability.LaunchBrowser, "FutureCapability"]);
  assert.equal(sdk.PersonDataFromJSON({ sex: "Unknown" }).sex, sdk.Sex.Unknown);
  assert.equal(sdk.PersonDataFromJSON({ sex: null }).sex, null);
  assert.equal(sdk.IntegrationStepToJSON(step).method, "FutureLaunchMethod");
});
