#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const versionEntry = "META-INF/maven/org.openapitools/openapi-generator-cli/pom.properties";
export const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const json = path => JSON.parse(readFileSync(path, "utf8"));
const encode = value => `${JSON.stringify(value, null, 2)}\n`;

function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}

function safePath(path) {
  requireThat(typeof path === "string" && /^[A-Za-z0-9_.\/-]+$/.test(path)
    && !path.startsWith("/") && !path.split("/").some(part => ["", ".", ".."].includes(part)), `Invalid template path: ${path}`);
  return path;
}

function validateGenerator(generator) {
  requireThat(/^\d+\.\d+\.\d+[A-Za-z0-9.+-]*$/.test(generator.version), "Invalid generator version");
  requireThat(new URL(generator.downloadUrl).protocol === "https:" && !/[${}]/.test(generator.downloadUrl), "Generator download URL must be a literal HTTPS URL");
  requireThat(/^[a-f0-9]{64}$/.test(generator.sha256), "Invalid generator SHA-256");
}

function validateManifest(manifest) {
  requireThat(manifest.schemaVersion === 1 && Array.isArray(manifest.templates) && manifest.templates.length > 0, "Unsupported template manifest");
  validateGenerator(manifest.generator);
  const paths = new Set();
  for (const entry of manifest.templates) {
    requireThat(/^[a-z][a-z0-9-]*$/.test(entry.generator), "Invalid template generator");
    for (const key of ["upstreamPath", "outputPath", "patch"]) safePath(entry[key]);
    requireThat(entry.outputPath.startsWith(`${entry.generator}/`) && entry.patch.startsWith("patches/"), "Template paths must belong to their generator and patches directory");
    requireThat(/^[a-f0-9]{64}$/.test(entry.upstreamSha256), "Invalid upstream template SHA-256");
    requireThat(!paths.has(entry.outputPath) && !paths.has(entry.patch), "Duplicate template or patch path");
    paths.add(entry.outputPath); paths.add(entry.patch);
  }
}

export function readState(root = repository) {
  const config = json(join(root, "openapitools.json"));
  const manifest = json(join(root, "templates/manifest.json"));
  validateManifest(manifest);
  const configured = config["generator-cli"];
  requireThat(configured?.version === manifest.generator.version
    && configured?.repository?.downloadUrl === manifest.generator.downloadUrl,
  "Generator pin differs from templates/manifest.json. Stage and review it with npm run templates:upgrade; do not update the manifest blindly.");
  const patches = manifest.templates.map(entry => readFileSync(join(root, "templates", entry.patch)));
  const fingerprint = sha256(JSON.stringify([config, manifest, patches.map(sha256)]));
  return { config, manifest, patches, fingerprint };
}

// Never let git discover the surrounding workspace or use an inherited index.
function command(program, args, cwd, accepted = [0]) {
  const env = { ...process.env, GIT_CEILING_DIRECTORIES: dirname(cwd), GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" };
  for (const key of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[key];
  const result = spawnSync(program, args, { cwd, env, maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  requireThat(result.signal === null && accepted.includes(result.status), `${program} failed: ${result.stderr?.toString() || result.stdout?.toString()}`);
  return result;
}

function embedded(jar, entry) {
  safePath(entry);
  return command("unzip", ["-p", resolve(jar), entry], dirname(resolve(jar))).stdout;
}

function verifyArtifact(jar, generator) {
  requireThat(sha256(readFileSync(jar)) === generator.sha256, `Generator artifact checksum mismatch: ${jar}. Expected ${generator.sha256}; refusing to generate.`);
  const version = embedded(jar, versionEntry).toString().match(/^version=(.+)$/m)?.[1].trim();
  requireThat(version === generator.version, `JAR version ${version} does not match expected ${generator.version}`);
}

function cachePath(root, version) {
  return join(root, "node_modules/@openapitools/openapi-generator-cli/versions", `${version}.jar`);
}

function writeAtomic(path, bytes) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  try { writeFileSync(temporary, bytes); renameSync(temporary, path); }
  finally { rmSync(temporary, { force: true }); }
}

async function download(url, path, expectedHash) {
  requireThat(new URL(url).protocol === "https:", "Generator downloads require HTTPS");
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  requireThat(response.ok, `Generator download failed: ${response.status} ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (expectedHash) requireThat(sha256(bytes) === expectedHash, "Downloaded generator artifact checksum mismatch; nothing was cached");
  writeAtomic(path, bytes);
}

async function resolveJar(root, generator, supplied) {
  const jar = supplied ? resolve(supplied) : cachePath(root, generator.version);
  if (!supplied && !existsSync(jar)) await download(generator.downloadUrl, jar, generator.sha256);
  verifyArtifact(jar, generator);
  return jar;
}

function withTemporaryDirectory(callback) {
  const directory = mkdtempSync(join(tmpdir(), "trinsic-templates-"));
  try { return callback(directory); }
  finally { rmSync(directory, { recursive: true, force: true }); }
}

function write(path, bytes) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, bytes);
}

function applyPatch(directory, entry, patch) {
  if (patch.length === 0) return;
  // Each patch may edit exactly its registered template, never other files.
  const headers = patch.toString().match(/^(?:---|\+\+\+) .+$/gm);
  requireThat(JSON.stringify(headers) === JSON.stringify([`--- a/${entry.outputPath}`, `+++ b/${entry.outputPath}`])
    && !/^(?:diff --git|GIT binary patch|rename |copy |new file |deleted file )/m.test(patch.toString()), `Patch must edit only ${entry.outputPath}`);
  const path = join(directory, "change.patch");
  writeFileSync(path, patch);
  try {
    command("git", ["apply", "--check", "--whitespace=nowarn", path], directory);
    command("git", ["apply", "--whitespace=nowarn", path], directory);
  } finally { rmSync(path, { force: true }); }
}

function render(state, jar, directory) {
  for (const [index, entry] of state.manifest.templates.entries()) {
    const original = embedded(jar, entry.upstreamPath);
    requireThat(sha256(original) === entry.upstreamSha256, `Upstream template checksum mismatch: ${entry.upstreamPath}. Review the generator upgrade before rebasing patches.`);
    write(join(directory, entry.outputPath), original);
    applyPatch(directory, entry, state.patches[index]);
  }
}

export async function checkTemplates(root = repository, suppliedJar) {
  const state = readState(root);
  const jar = await resolveJar(root, state.manifest.generator, suppliedJar);
  withTemporaryDirectory(directory => render(state, jar, directory));
  return { state, jar };
}

export async function prepareTemplates(root, output, suppliedJar) {
  const { state, jar } = await checkTemplates(root, suppliedJar);
  requireThat(!existsSync(output) || readdirSync(output).length === 0, "Template output directory must be empty");
  // Validate everything before publishing any rendered overrides.
  withTemporaryDirectory(directory => {
    render(state, jar, directory);
    for (const entry of state.manifest.templates) write(join(output, entry.outputPath), readFileSync(join(directory, entry.outputPath)));
  });
  return jar;
}

function diff(directory, oldBytes, newBytes, path) {
  const old = join(directory, "old"), next = join(directory, "new");
  writeFileSync(old, oldBytes); writeFileSync(next, newBytes);
  const result = command("git", ["diff", "--no-index", "--no-ext-diff", "--no-color", "--text", old, next], directory, [0, 1]);
  if (result.status === 0) return "";
  const text = result.stdout.toString();
  return `--- a/${path}\n+++ b/${path}\n${text.slice(text.indexOf("@@"))}`;
}

export async function stageUpgrade(root, { version, url, jar: suppliedJar, output }) {
  requireThat(version && url && output, "upgrade requires --version, --url, and --output");
  const { state, jar: oldJar } = await checkTemplates(root);
  validateGenerator({ version, downloadUrl: url, sha256: "0".repeat(64) });
  requireThat(!existsSync(output), `Upgrade directory already exists: ${output}`);
  mkdirSync(output, { recursive: true });
  const candidateJar = join(output, "generator.jar");
  if (suppliedJar) write(candidateJar, readFileSync(suppliedJar));
  else await download(url, candidateJar);
  const generator = { version, downloadUrl: url, sha256: sha256(readFileSync(candidateJar)) };
  verifyArtifact(candidateJar, generator);
  const conflicts = [], changed = [];
  let upstreamDiff = "";
  withTemporaryDirectory(directory => {
    const current = join(directory, "current");
    render(state, oldJar, current);
    for (const entry of state.manifest.templates) {
      const oldBytes = embedded(oldJar, entry.upstreamPath), newBytes = embedded(candidateJar, entry.upstreamPath);
      const old = join(output, "upstream-old", entry.outputPath);
      const next = join(output, "upstream-new", entry.outputPath);
      write(old, oldBytes); write(next, newBytes);
      const delta = diff(directory, oldBytes, newBytes, entry.outputPath);
      upstreamDiff += delta;
      if (delta) changed.push(entry.outputPath);
      const merge = command("git", ["merge-file", "--diff3", "-p", "-L", "local-patch", "-L", "old-upstream", "-L", "new-upstream", join(current, entry.outputPath), old, next], directory, Array.from({ length: 128 }, (_, i) => i));
      if (merge.status > 0) conflicts.push(entry.outputPath);
      write(join(output, "merged", entry.outputPath), merge.stdout);
    }
  });
  write(join(output, "upstream.diff"), upstreamDiff);
  const review = { schemaVersion: 1, baseFingerprint: state.fingerprint, generator, changed, conflicts };
  write(join(output, "review.json"), encode(review));
  return review;
}

export async function acceptUpgrade(root, directory, reviewed) {
  requireThat(reviewed, "Acceptance requires --reviewed after inspecting upstream.diff and every merged template, even when there are no conflicts.");
  const { state } = await checkTemplates(root);
  const review = json(join(directory, "review.json"));
  requireThat(review.schemaVersion === 1 && review.baseFingerprint === state.fingerprint, "The generator pin or patches changed since this upgrade was staged; stage it again.");
  validateGenerator(review.generator);
  const jar = join(directory, "generator.jar");
  verifyArtifact(jar, review.generator);
  const manifest = structuredClone(state.manifest);
  manifest.generator = review.generator;
  const patches = [];
  // Review artifacts may have been edited to resolve conflicts. Rebuild patches
  // from the verified candidate JAR, not the editable upstream snapshots.
  withTemporaryDirectory(temporary => {
    for (const entry of manifest.templates) {
      const original = embedded(jar, entry.upstreamPath);
      requireThat(readFileSync(join(directory, "upstream-new", entry.outputPath)).equals(original), `Staged upstream snapshot changed: ${entry.outputPath}`);
      const merged = readFileSync(join(directory, "merged", entry.outputPath));
      requireThat(!/^(?:<{7}|={7}|>{7}|\|{7})(?: |$)/m.test(merged.toString()), `Unresolved merge conflict: ${entry.outputPath}`);
      entry.upstreamSha256 = sha256(original);
      const patch = Buffer.from(diff(temporary, original, merged, entry.outputPath));
      patches.push(patch);
      write(join(temporary, entry.outputPath), original);
      applyPatch(temporary, entry, patch);
      requireThat(readFileSync(join(temporary, entry.outputPath)).equals(merged), `Patch failed to reproduce reviewed template: ${entry.outputPath}`);
    }
  });
  const config = structuredClone(state.config);
  config["generator-cli"].version = review.generator.version;
  config["generator-cli"].repository.downloadUrl = review.generator.downloadUrl;
  // All preflight checks have passed. Replace each file atomically, with the
  // generator pin updated last.
  writeAtomic(cachePath(root, review.generator.version), readFileSync(jar));
  manifest.templates.forEach((entry, index) => writeAtomic(join(root, "templates", entry.patch), patches[index]));
  writeAtomic(join(root, "templates/manifest.json"), encode(manifest));
  writeAtomic(join(root, "openapitools.json"), encode(config));
  return manifest;
}

async function main() {
  const [action, ...args] = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--reviewed") { options.reviewed = true; continue; }
    requireThat(["--jar", "--version", "--url", "--output", "--from"].includes(args[i]) && args[i + 1] && !args[i + 1].startsWith("--"), `Unknown or incomplete option: ${args[i]}`);
    options[args[i].slice(2)] = args[++i];
  }
  if (action === "check") {
    const { state } = await checkTemplates(repository, options.jar);
    console.log(`Verified generator ${state.manifest.generator.version}, artifact checksum, ${state.manifest.templates.length} upstream checksums, and all patches.`);
  } else if (action === "prepare") {
    requireThat(options.output, "prepare requires --output");
    console.log(await prepareTemplates(repository, resolve(options.output), options.jar));
  } else if (action === "upgrade") {
    const review = await stageUpgrade(repository, { ...options, output: options.output && resolve(options.output) });
    console.log(`Staged ${review.generator.version}: ${review.changed.length} changed upstream templates, ${review.conflicts.length} conflicts.\nReview ${options.output}/upstream.diff, review.json, and merged/.\nResolve conflicts, then run npm run templates:accept -- --from ${options.output} --reviewed.\nNo tracked files were changed.`);
  } else if (action === "accept") {
    requireThat(options.from, "accept requires --from");
    const manifest = await acceptUpgrade(repository, resolve(options.from), options.reviewed);
    console.log(`Accepted generator ${manifest.generator.version} and rebased patches. Rebuild SDKs, inspect generated changes, and run construction and header checks before committing.`);
  } else {
    throw new Error("Usage: template-overrides.mjs check [--jar PATH] | prepare --output DIR | upgrade --version VERSION --url URL --output DIR [--jar PATH] | accept --from DIR --reviewed");
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
