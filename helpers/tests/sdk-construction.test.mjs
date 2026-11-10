import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const probes = join(root, "helpers/tests/probes");
const selected = (language) => !process.env.SDK_LANGUAGE || process.env.SDK_LANGUAGE === language;

async function run(command, args, options = {}) {
  const { fails = false, ...spawnOptions } = options;
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
    if (fails) assert.notEqual(code, 0, `Unsafe construction unexpectedly compiled: ${command}`);
    else assert.equal(code, 0, `${command} ${args.join(" ")} failed:\n${output}`);
    return output;
  } finally { clearTimeout(timer); }
}

async function temporaryDirectory(t) {
  await mkdir(join(root, ".context"), { recursive: true });
  const directory = await mkdtemp(join(root, ".context/sdk-construction-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test("C# rejects positional and incomplete construction while preserving JSON behavior", {
  skip: !selected("csharp"), timeout: 240_000,
}, async t => {
  const directory = await temporaryDirectory(t);
  const sdk = join(directory, "sdk");
  await run(join(root, "helpers/generate-client.sh"), [
    "--language", "csharp", "--output-folder", sdk,
    "--swagger-file-or-url", join(root, "helpers/tests/fixtures/construction.json"),
    "--additional-property", "packageName=Trinsic.Api,library=httpclient,targetFramework=net8.0,nullableReferenceTypes=true,modelPropertySorting=alphabetical,validatable=false,disallowAdditionalPropertiesIfNotPresent=false",
  ]);
  const consumer = join(directory, "consumer");
  await mkdir(consumer);
  const project = join(consumer, "Probe.csproj");
  await writeFile(project, `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework></PropertyGroup><ItemGroup><ProjectReference Include="../sdk/src/Trinsic.Api/Trinsic.Api.csproj" /></ItemGroup></Project>`);
  await writeFile(join(consumer, "Program.cs"), await readFile(join(probes, "construction.cs")));
  await run("dotnet", ["run", "--project", project]);
  await writeFile(join(consumer, "Program.cs"), `using Trinsic.Api.Model;
_ = new StringPair("A", "B");
_ = new RequiredInput();
_ = new DerivedInput { Child = "child" };
_ = new ChildInput { Child = "child" };
`);
  const errors = await run("dotnet", ["build", project, "--no-restore"], { fails: true });
  assert.match(errors, /CS1729/, "Positional constructor must be absent");
  assert.match(errors, /CS9035.*RequiredInput.Name/, "Required properties must be compiler-enforced");
  assert.match(errors, /CS9035.*BaseInput.Id/, "Inherited required properties must be compiler-enforced");
  // Also check the SDK produced by the real build script, so accidentally
  // bypassing template preparation cannot leave the fixture test green.
  const actualProject = relative(consumer, join(root, "api-csharp/sdk/src/Trinsic.Api/Trinsic.Api.csproj"));
  await writeFile(project, `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework></PropertyGroup><ItemGroup><ProjectReference Include="${actualProject}" /></ItemGroup></Project>`);
  await writeFile(join(consumer, "Program.cs"), `using System;
using System.Linq;
using Trinsic.Api.Model;
foreach (var type in typeof(CreateHostedProviderSessionRequest).Assembly.GetTypes()
    .Where(t => t.Namespace == typeof(CreateHostedProviderSessionRequest).Namespace && t.IsClass && !t.IsAbstract))
    if (type.GetConstructors().Any(c => c.GetParameters().Length != 0))
        throw new Exception($"Public positional model constructor: {type}");
`);
  await run("dotnet", ["run", "--project", project]);
});

test("Go rejects positional factories and unkeyed literals while retaining named construction", {
  skip: !selected("go"), timeout: 240_000,
}, async t => {
  const directory = await temporaryDirectory(t);
  const sdk = join(root, "api-go/sdk-build");
  const module = (await readFile(join(sdk, "go.mod"), "utf8")).match(/^module (.+)$/m)[1];
  const major = module.match(/\/v(\d+)$/)?.[1] ?? "1";
  await writeFile(join(directory, "go.mod"), `module construction-probe\n\ngo 1.23\nrequire ${module} v${major}.0.0\nreplace ${module} => ${JSON.stringify(sdk)}\n`);
  const source = (await readFile(join(probes, "construction.go"), "utf8")).replace("SDK_MODULE", module);
  await writeFile(join(directory, "main.go"), source);
  await run("go", ["run", "."], { cwd: directory });
  await writeFile(join(directory, "main.go"), `package main
import sdk "${module}"
func main() { _ = sdk.NewCreateHostedProviderSessionRequest("provider", "profile", "redirect", false) }
`);
  assert.match(await run("go", ["build", "."], { cwd: directory, fails: true }), /undefined: sdk.NewCreateHostedProviderSessionRequest/);
  await writeFile(join(directory, "main.go"), `package main
import sdk "${module}"
func main() { _ = sdk.CreateHostedProviderSessionRequest{struct{}{}, "provider", "profile", "redirect", false, nil, sdk.NullableProviderInput{}, nil} }
`);
  assert.match(await run("go", ["build", "."], { cwd: directory, fails: true }), /unexported field/, "Unkeyed literals must also be prohibited outside the SDK");
});

test("Java hides field constructors and still deserializes read-only properties", {
  skip: !selected("java"), timeout: 240_000,
}, async t => {
  const directory = await temporaryDirectory(t);
  const sdk = join(root, "api-java/sdk-build");
  const init = join(directory, "classpath.gradle");
  await writeFile(init, "allprojects { afterEvaluate { tasks.register('constructionClasspath') { doLast { println sourceSets.main.runtimeClasspath.asPath } } } }\n");
  const output = await run("./gradlew", ["--quiet", "--console=plain", "--init-script", init, "constructionClasspath"], { cwd: sdk });
  const classpath = output.trim().split("\n").find(line => line.includes("build/classes/java/main"));
  assert.ok(classpath, `Missing Java classpath:\n${output}`);
  await run("javac", ["-cp", classpath, "-d", directory, join(probes, "ConstructionProbe.java")]);
  await run("java", ["-cp", `${directory}:${classpath}`, "ConstructionProbe"]);
  const unsafe = join(directory, "UnsafeConstruction.java");
  await writeFile(unsafe, `import id.trinsic.api.models.AadhaarLanguage;
class UnsafeConstruction { Object value = new AadhaarLanguage("English"); }
`);
  assert.match(await run("javac", ["-cp", classpath, "-d", directory, unsafe], { fails: true }), /private access/);
});

test("Python rejects positional model fields and preserves keyword construction", {
  skip: !selected("python"), timeout: 240_000,
}, async () => {
  const sdk = join(root, "api-python/sdk");
  await run(join(sdk, ".venv/bin/python"), [join(probes, "construction.py")], {
    env: { ...process.env, PYTHONPATH: sdk },
  });
});

test("Ruby rejects positional model fields and preserves attribute hashes", {
  skip: !selected("ruby"), timeout: 240_000,
}, async () => {
  await run("ruby", ["-I", join(root, "api-ruby/sdk/lib"), join(probes, "construction.rb")]);
});

test("TypeScript requires named endpoint fields and serializes the request object correctly", {
  skip: !selected("typescript"), timeout: 240_000,
}, async t => {
  const directory = await temporaryDirectory(t);
  const sdk = join(root, "api-typescript/sdk");
  const source = join(directory, "construction.ts");
  await writeFile(source, `import { SessionsApi } from ${JSON.stringify(join(sdk, "dist"))};
const api = new SessionsApi();
api.getSession({ sessionId: "session" });
api.listSessions({ verificationProfileId: "profile", page: 2, pageSize: 3 });
api.createHostedProviderSession({ createHostedProviderSessionRequest: {
  provider: "provider", verificationProfileId: "profile", redirectUrl: "https://example.test",
  enableRedirectBackwardsCompatibility: false,
} });
// @ts-expect-error positional endpoint fields are not supported
api.getSession("session");
// @ts-expect-error positional pagination is not supported
api.listSessions("profile", undefined, undefined, 3, 2);
// @ts-expect-error the body must be passed under its request property
api.createHostedProviderSession({ provider: "provider" });
`);
  await run(process.execPath, [join(sdk, "node_modules/typescript/bin/tsc"), "--noEmit", "--strict", "--skipLibCheck", "--lib", "es2020,dom", source]);
  const require = createRequire(import.meta.url);
  const { Configuration, SessionsApi } = require(join(sdk, "dist"));
  const requests = [];
  const api = new SessionsApi(new Configuration({
    basePath: "https://example.test",
    fetchApi: async (url, init) => {
      requests.push({ url: new URL(url), init });
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    },
  }));
  await api.listSessionsRaw({ verificationProfileId: "profile-id", page: 2, pageSize: 3 });
  const body = { provider: "provider-id", verificationProfileId: "profile-id", redirectUrl: "https://example.test/return", enableRedirectBackwardsCompatibility: false };
  await api.createHostedProviderSessionRaw({ createHostedProviderSessionRequest: body });
  await api.getSessionResultRaw({ sessionId: "session-id", getSessionResultRequest: { resultsAccessKey: "result-key", redirectToken: "redirect-token" } });
  assert.equal(requests[0].url.pathname, "/api/v1/verification-profiles/profile-id/sessions");
  assert.equal(requests[0].url.searchParams.get("Page"), "2");
  assert.equal(requests[0].url.searchParams.get("PageSize"), "3");
  assert.deepEqual(JSON.parse(requests[1].init.body), body);
  assert.ok(requests[2].url.pathname.includes("session-id"));
  assert.deepEqual(JSON.parse(requests[2].init.body), { resultsAccessKey: "result-key", redirectToken: "redirect-token" });
});
