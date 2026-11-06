import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { injectSdkHeader } from "../inject-sdk-header.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const probes = join(root, "helpers/tests/probes");

async function run(command, args, options = {}) {
  const child = spawn(command, args, { cwd: root, ...options, stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  let errors = "";
  child.stdout.on("data", (data) => { output += data; });
  child.stderr.on("data", (data) => { errors += data; });
  const timer = setTimeout(() => child.kill("SIGKILL"), 120_000);
  try {
    const [code] = await once(child, "close");
    assert.equal(code, 0, `${command} ${args.join(" ")} failed:\n${output}\n${errors}`);
    return output.trim();
  } finally {
    clearTimeout(timer);
  }
}

async function temporaryDirectory(t) {
  await mkdir(join(root, ".context"), { recursive: true });
  const directory = await mkdtemp(join(root, ".context/sdk-header-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test("generation rejects missing injection points without partially patching APIs", async (t) => {
  const directory = await temporaryDirectory(t);
  const apiDirectory = join(directory, "src/main/java/id/trinsic/api");
  await mkdir(apiDirectory, { recursive: true });
  const original = "    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();\n";
  await writeFile(join(apiDirectory, "FirstApi.java"), original);
  await writeFile(join(apiDirectory, "SecondApi.java"), "changed generator output");
  assert.throws(() => injectSdkHeader("java", "1.2.3-beta.1", directory), /injection point/);
  assert.equal(await readFile(join(apiDirectory, "FirstApi.java"), "utf8"), original);
  assert.throws(() => injectSdkHeader("swift", "1.2.3", directory), /not configured/);
  assert.throws(() => injectSdkHeader("java", "1.2.3\r\nInjected: value", directory), /Invalid SDK version/);
});

for (const language of ["csharp", "go", "java", "python", "ruby", "typescript"]) {
  test(`${language} sends SDK identity, authentication, and custom headers`, {
    skip: process.env.SDK_LANGUAGE && process.env.SDK_LANGUAGE !== language,
    timeout: 240_000,
  }, async (t) => {
    const directory = await temporaryDirectory(t);
    const version = await run(join(root, "get-version.sh"), ["--version-name", language === "typescript" ? "node" : language]);
    const requests = [];
    const server = createServer((request, response) => {
      requests.push({ method: request.method, url: request.url, headers: request.headers });
      request.resume();
      response.writeHead(204).end();
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => { server.closeAllConnections(); server.close(); });
    const env = {
      ...process.env,
      SDK_TEST_URL: `http://127.0.0.1:${server.address().port}`,
      SDK_TEST_ROOT: root,
      DOTNET_ROLL_FORWARD: "LatestMajor",
    };

    switch (language) {
      case "typescript":
        await run(process.execPath, [join(probes, "typescript.cjs")], { env });
        break;
      case "python":
        await run(join(root, "api-python/sdk/.venv/bin/python"), [join(probes, "python.py")], {
          env: { ...env, PYTHONPATH: join(root, "api-python/sdk") },
        });
        break;
      case "ruby":
        await run("ruby", ["-I", join(root, "api-ruby/sdk/lib"), join(probes, "ruby.rb")], { env });
        break;
      case "go": {
        const sdk = join(root, "api-go/sdk-build");
        const module = (await readFile(join(sdk, "go.mod"), "utf8")).match(/^module (.+)$/m)[1];
        await writeFile(join(directory, "go.mod"), `module sdk-header-test\n\ngo 1.23\nrequire ${module} v${version}\nreplace ${module} => ${JSON.stringify(sdk)}\n`);
        const source = (await readFile(join(probes, "go.go"), "utf8")).replace("SDK_MODULE", module);
        await writeFile(join(directory, "main.go"), source);
        await run("go", ["run", "."], { env, cwd: directory });
        break;
      }
      case "csharp": {
        await writeFile(join(directory, "Probe.csproj"), `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings></PropertyGroup><ItemGroup><ProjectReference Include="${join(root, "api-csharp/sdk/src/Trinsic.Api/Trinsic.Api.csproj")}" /></ItemGroup></Project>`);
        await writeFile(join(directory, "Program.cs"), await readFile(join(probes, "csharp.cs")));
        await run("dotnet", ["run", "--project", join(directory, "Probe.csproj"), "--configuration", "Release"], { env });
        break;
      }
      case "java": {
        const sdk = join(root, "api-java/sdk-build");
        const initScript = join(directory, "classpath.gradle");
        await writeFile(initScript, "allprojects { afterEvaluate { tasks.register('sdkHeaderClasspath') { doLast { println sourceSets.main.runtimeClasspath.asPath } } } }\n");
        const classpath = await run("./gradlew", ["--quiet", "--console=plain", "--init-script", initScript, "sdkHeaderClasspath"], { cwd: sdk, env });
        await run("javac", ["-cp", classpath, "-d", directory, join(probes, "SdkHeaderProbe.java")], { env });
        await run("java", ["-cp", `${directory}:${classpath}`, "SdkHeaderProbe"], { env });
        break;
      }
    }

    assert.ok(requests.length >= 2, "Expected requests from multiple API classes");
    assert.ok(requests.some((request) => request.method === "GET" && request.url.startsWith("/api/v1/providers")));
    assert.ok(requests.some((request) => request.method === "POST" && request.url.endsWith("/cancel")));
    if (language === "typescript") {
      assert.ok(requests.some((request) => request.headers["x-multi-value"] === "first, second"));
    }
    for (const request of requests) {
      assert.equal(request.headers["x-trinsic-sdk"], `${language}/${version}`);
      assert.equal(request.headers.authorization, "Bearer sdk-header-test-token");
      assert.equal(request.headers["x-test-header"], "preserved");
    }
  });
}
