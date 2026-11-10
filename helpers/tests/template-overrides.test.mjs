import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { acceptUpgrade, checkTemplates, prepareTemplates, readState, sha256, stageUpgrade } from "../template-overrides.mjs";

const original = ["// model", "public Model(string alpha) {}", ...Array.from({ length: 10 }, (_, i) => `// serialization ${i}`), "// upstream: old", ""].join("\n");
const outputPath = "csharp/modelGeneric.mustache";
const patchPath = `patches/${outputPath}.patch`;
const patch = `--- a/${outputPath}\n+++ b/${outputPath}\n@@ -1,3 +1,3 @@\n // model\n-public Model(string alpha) {}\n+public Model() {}\n // serialization 0\n`;
const readJson = path => JSON.parse(readFileSync(path, "utf8"));
function write(path, value) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, value); }
function writeJson(path, value) { write(path, `${JSON.stringify(value, null, 2)}\n`); }

function makeJar(directory, version, source = original) {
  const tree = mkdtempSync(join(directory, "jar-source-"));
  write(join(tree, outputPath), source);
  write(join(tree, "META-INF/maven/org.openapitools/openapi-generator-cli/pom.properties"), `artifactId=openapi-generator-cli\nversion=${version}\n`);
  const path = `${tree}.jar`;
  const result = spawnSync("zip", ["-qr", path, "."], { cwd: tree, encoding: "utf8" });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  return path;
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "template tests "));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const jar = makeJar(root, "1.0.0");
  const cached = join(root, "node_modules/@openapitools/openapi-generator-cli/versions/1.0.0.jar");
  write(cached, readFileSync(jar));
  const generator = { version: "1.0.0", downloadUrl: "https://example.test/custom-generator-1.0.0.jar", sha256: sha256(readFileSync(jar)) };
  writeJson(join(root, "openapitools.json"), { spaces: 2, "generator-cli": { version: generator.version, repository: { downloadUrl: generator.downloadUrl } } });
  writeJson(join(root, "templates/manifest.json"), {
    schemaVersion: 1, generator,
    templates: [{ generator: "csharp", upstreamPath: outputPath, outputPath, upstreamSha256: sha256(original), patch: patchPath }],
  });
  write(join(root, "templates", patchPath), patch);
  return { root, jar, cached, generator, output: join(root, "rendered") };
}

test("verified patches reproduce local behavior in a temporary override directory", async t => {
  const f = fixture(t);
  const fingerprint = readState(f.root).fingerprint;
  assert.equal(await prepareTemplates(f.root, f.output), f.cached);
  assert.equal(readFileSync(join(f.output, outputPath), "utf8"), original.replace("Model(string alpha)", "Model()"));
  assert.equal(readState(f.root).fingerprint, fingerprint);
  await assert.rejects(prepareTemplates(f.root, f.output), /must be empty/);
});

for (const field of ["version", "url"]) {
  test(`a changed generator ${field} requires a reviewed baseline update`, async t => {
    const f = fixture(t);
    const path = join(f.root, "openapitools.json");
    const config = readJson(path);
    if (field === "version") config["generator-cli"].version = "2.0.0";
    else config["generator-cli"].repository.downloadUrl = "https://example.test/different.jar";
    writeJson(path, config);
    await assert.rejects(prepareTemplates(f.root, f.output), /Generator pin differs/);
    assert.equal(existsSync(f.output), false);
  });
}

test("artifact tampering and template checksum drift fail before output is written", async t => {
  const f = fixture(t);
  const bytes = readFileSync(f.cached);
  write(f.cached, Buffer.concat([bytes, Buffer.from("tampered")]));
  await assert.rejects(prepareTemplates(f.root, f.output), /artifact checksum mismatch/);
  write(f.cached, bytes);
  const path = join(f.root, "templates/manifest.json");
  const manifest = readJson(path);
  manifest.templates[0].upstreamSha256 = "0".repeat(64);
  writeJson(path, manifest);
  await assert.rejects(prepareTemplates(f.root, f.output), /Upstream template checksum mismatch/);
  assert.equal(existsSync(f.output), false);
});

test("the embedded generator version must agree with its declared version", async t => {
  const f = fixture(t);
  const wrong = makeJar(f.root, "9.0.0");
  write(f.cached, readFileSync(wrong));
  const path = join(f.root, "templates/manifest.json"), manifest = readJson(path);
  manifest.generator.sha256 = sha256(readFileSync(wrong));
  writeJson(path, manifest);
  await assert.rejects(checkTemplates(f.root), /JAR version 9.0.0 does not match expected 1.0.0/);
});

test("patch conflicts and unrelated file edits are rejected", async t => {
  const f = fixture(t);
  write(join(f.root, "templates", patchPath), patch.replace("-public Model(string alpha)", "-public Model(int different)"));
  await assert.rejects(prepareTemplates(f.root, f.output), /patch does not apply|patch failed/);
  write(join(f.root, "templates", patchPath), patch + "--- a/unrelated\n+++ b/unrelated\n@@ -1 +1 @@\n-old\n+new\n");
  await assert.rejects(prepareTemplates(f.root, f.output), /must edit only/);
  assert.equal(existsSync(f.output), false);
});

test("a missing cache is populated only from the configured URL with matching bytes", async t => {
  const f = fixture(t);
  const bytes = readFileSync(f.cached);
  rmSync(f.cached);
  const fetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = fetch; });
  let calls = 0;
  globalThis.fetch = async url => { calls++; assert.equal(url, f.generator.downloadUrl); return new Response("wrong artifact"); };
  await assert.rejects(checkTemplates(f.root), /Downloaded generator artifact checksum mismatch/);
  assert.equal(existsSync(f.cached), false);
  globalThis.fetch = async url => { calls++; assert.equal(url, f.generator.downloadUrl); return new Response(bytes); };
  await checkTemplates(f.root);
  await checkTemplates(f.root);
  assert.equal(calls, 2, "A verified cached artifact should not be downloaded again");
});

test("upgrades show upstream changes, merge local patches, and require explicit review", async t => {
  const f = fixture(t);
  const source = original.replace("upstream: old", "upstream: improved");
  const candidate = makeJar(f.root, "2.0.0", source);
  const output = join(f.root, "upgrade"), fingerprint = readState(f.root).fingerprint;
  const review = await stageUpgrade(f.root, { version: "2.0.0", url: "https://example.test/custom-2.0.0.jar", jar: candidate, output });
  assert.deepEqual(review.changed, [outputPath]);
  assert.deepEqual(review.conflicts, []);
  assert.match(readFileSync(join(output, "upstream.diff"), "utf8"), /\+\/\/ upstream: improved/);
  assert.equal(readFileSync(join(output, "merged", outputPath), "utf8"), source.replace("Model(string alpha)", "Model()"));
  await assert.rejects(acceptUpgrade(f.root, output, false), /requires --reviewed/);
  assert.equal(readState(f.root).fingerprint, fingerprint, "Staging and unreviewed acceptance must not change the pin or patches");
  await acceptUpgrade(f.root, output, true);
  const state = readState(f.root);
  assert.equal(state.manifest.generator.version, "2.0.0");
  assert.equal(state.manifest.generator.sha256, sha256(readFileSync(candidate)));
  assert.equal(state.manifest.templates[0].upstreamSha256, sha256(source));
  await prepareTemplates(f.root, f.output);
  assert.equal(readFileSync(join(f.output, outputPath), "utf8"), source.replace("Model(string alpha)", "Model()"));
});

test("a version-only upgrade still needs review even when upstream templates are identical", async t => {
  const f = fixture(t), output = join(f.root, "upgrade");
  const review = await stageUpgrade(f.root, { version: "2.0.0", url: "https://example.test/2.0.0.jar", jar: makeJar(f.root, "2.0.0"), output });
  assert.deepEqual(review.changed, []);
  assert.deepEqual(review.conflicts, []);
  await assert.rejects(acceptUpgrade(f.root, output, false), /requires --reviewed/);
  await acceptUpgrade(f.root, output, true);
  await checkTemplates(f.root);
});

test("conflicts must be resolved before accepting a new baseline", async t => {
  const f = fixture(t), output = join(f.root, "upgrade"), fingerprint = readState(f.root).fingerprint;
  const source = original.replace("string alpha", "string alpha, string bravo");
  const review = await stageUpgrade(f.root, { version: "2.0.0", url: "https://example.test/2.0.0.jar", jar: makeJar(f.root, "2.0.0", source), output });
  assert.deepEqual(review.conflicts, [outputPath]);
  await assert.rejects(acceptUpgrade(f.root, output, true), /Unresolved merge conflict/);
  assert.equal(readState(f.root).fingerprint, fingerprint);
  const resolved = source.replace("Model(string alpha, string bravo)", "Model()");
  write(join(output, "merged", outputPath), resolved);
  await acceptUpgrade(f.root, output, true);
  await prepareTemplates(f.root, f.output);
  assert.equal(readFileSync(join(f.output, outputPath), "utf8"), resolved);
});

test("a staged upgrade becomes stale when local patches change", async t => {
  const f = fixture(t), output = join(f.root, "upgrade");
  await stageUpgrade(f.root, { version: "2.0.0", url: "https://example.test/2.0.0.jar", jar: makeJar(f.root, "2.0.0"), output });
  write(join(f.root, "templates", patchPath), patch.replace("+public Model()", "+internal Model()"));
  await assert.rejects(acceptUpgrade(f.root, output, true), /changed since this upgrade was staged/);
  assert.equal(readState(f.root).manifest.generator.version, "1.0.0");
});

test("acceptance rejects candidate tampering and edits to upstream snapshots", async t => {
  const f = fixture(t), output = join(f.root, "upgrade");
  await stageUpgrade(f.root, { version: "2.0.0", url: "https://example.test/2.0.0.jar", jar: makeJar(f.root, "2.0.0"), output });
  const jar = join(output, "generator.jar"), bytes = readFileSync(jar);
  write(jar, Buffer.concat([bytes, Buffer.from("tamper")]));
  await assert.rejects(acceptUpgrade(f.root, output, true), /artifact checksum mismatch/);
  write(jar, bytes);
  write(join(output, "upstream-new", outputPath), "edited upstream");
  await assert.rejects(acceptUpgrade(f.root, output, true), /upstream snapshot changed/);
  assert.equal(readState(f.root).manifest.generator.version, "1.0.0");
});

test("the real generation helper stops before deleting SDK output when the baseline drifts", t => {
  const f = fixture(t);
  const helpers = fileURLToPath(new URL("..", import.meta.url));
  for (const file of ["generate-client.sh", "common.sh", "template-overrides.mjs"])
    write(join(f.root, "helpers", file), readFileSync(join(helpers, file)));
  write(join(f.output, "existing-sdk.txt"), "keep this SDK");
  const path = join(f.root, "openapitools.json"), config = readJson(path);
  config["generator-cli"].version = "2.0.0";
  writeJson(path, config);
  const result = spawnSync("bash", [join(f.root, "helpers/generate-client.sh"), "--language", "csharp", "--output-folder", f.output], {
    cwd: f.root, encoding: "utf8", timeout: 10_000,
  });
  assert.ifError(result.error);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Generator pin differs/);
  assert.equal(readFileSync(join(f.output, "existing-sdk.txt"), "utf8"), "keep this SDK");
  assert.equal(existsSync(join(f.root, "helpers/swagger.json")), false, "Schema download must not start before baseline verification");
});
