import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

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
  const directory = await mkdtemp(join(root, ".context/sdk-wire-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

for (const language of ["java", "python", "ruby", "typescript"]) {
  test(`${language} preserves wire formats`, {
    skip: process.env.SDK_LANGUAGE && process.env.SDK_LANGUAGE !== language,
    timeout: 240_000,
  }, async (t) => {
    const directory = await temporaryDirectory(t);
    const requests = [];
    const server = createServer((request, response) => {
      const chunks = [];
      request.on("data", chunk => chunks.push(chunk));
      request.on("end", () => {
        requests.push({ method: request.method, url: request.url, headers: request.headers, body: Buffer.concat(chunks).toString() });
        response.writeHead(204).end();
      });
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => { server.closeAllConnections(); server.close(); });
    const env = {
      ...process.env,
      SDK_TEST_URL: `http://127.0.0.1:${server.address().port}`,
      SDK_TEST_ROOT: root,
    };

    switch (language) {
      case "typescript":
        for (const TZ of ["UTC", "America/Los_Angeles", "Pacific/Kiritimati", "Pacific/Apia"]) {
          await run(process.execPath, [join(probes, "wire_typescript.cjs")], { env: { ...env, TZ } });
        }
        break;
      case "python":
        await run(join(root, "api-python/sdk/.venv/bin/python"), [join(probes, "wire_python.py")], {
          env: { ...env, PYTHONPATH: join(root, "api-python/sdk") },
        });
        break;
      case "ruby":
        await run("ruby", ["-I", join(root, "api-ruby/sdk/lib"), join(probes, "wire_ruby.rb")], { env });
        break;
      case "java": {
        const sdk = join(root, "api-java/sdk-build");
        const initScript = join(directory, "classpath.gradle");
        await writeFile(initScript, "allprojects { afterEvaluate { tasks.register('wireClasspath') { doLast { println sourceSets.main.runtimeClasspath.asPath } } } }\n");
        const classpath = await run("./gradlew", ["--quiet", "--console=plain", "--init-script", initScript, "wireClasspath"], { cwd: sdk, env });
        await run("javac", ["-cp", classpath, "-d", directory, join(probes, "WireProbe.java")], { env });
        await run("java", ["-cp", `${directory}:${classpath}`, "WireProbe"], { env });
        break;
      }
    }

    if (["java", "ruby"].includes(language)) {
      assert.equal(requests.length, 6, "Exercise absent, null, empty, and populated optional multipart fields");
      for (const request of requests) {
        const contentType = request.headers["content-type"];
        assert.match(contentType, /^multipart\/form-data;.*boundary=/i);
        const boundary = contentType.match(/boundary="?([^";]+)/i)[1];
        assert.ok(request.body.startsWith(`--${boundary}\r\n`));
        assert.ok(request.body.includes(`--${boundary}--`));
        assert.match(request.body, /name="Alias"/);
        assert.match(request.body, /name="BrandName"/);
      }
      for (const request of requests.slice(0, 3)) {
        assert.doesNotMatch(request.body, /name="Logo"/);
        assert.doesNotMatch(request.body, /name="Providers"/);
      }
      assert.doesNotMatch(requests[3].body, /name="Logo"/);
      assert.match(requests[3].body, /provider-one/);
      assert.doesNotMatch(requests[4].body, /name="Providers"/);
      for (const request of requests.slice(4)) {
        assert.match(request.body, /name="Logo"/);
        assert.match(request.body, /logo bytes/);
      }
      assert.match(requests[5].body, /provider-one/);
    }
    if (language === "python") {
      assert.equal(requests.length, 3);
      const values = requests.map(request => JSON.parse(request.body).providerInput["brazil-cpf-lookup"].selfieImage);
      assert.deepEqual(values, ["AP8rLw==", "AP8rLw==", ""]);
    }
  });
}
