import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

// Run the actual scripts in an isolated repository with fake registry clients.
// No npm/gem command in these tests can reach a package registry.
function fixture(t, sdk, version = "1.2.3-beta.1") {
  const directory = mkdtempSync(join(tmpdir(), "sdk publishing test "));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const bin = join(directory, "bin");
  const packages = join(directory, sdk, "sdk/publish");
  mkdirSync(bin);
  mkdirSync(packages, { recursive: true });
  mkdirSync(join(directory, "helpers"));
  for (const file of [`${sdk}/publish-sdk.sh`, "helpers/common.sh", "get-version.sh"]) {
    copyFileSync(join(root, file), join(directory, file));
  }
  writeFileSync(join(directory, "versions.json"), JSON.stringify({
    node: version, webUIVersion: version, expoUIVersion: version,
  }));
  const log = join(directory, "commands.jsonl");
  writeFileSync(log, "");
  for (const command of ["npm", "gem"]) {
    writeFileSync(join(bin, command), `#!/usr/bin/env node
const fs = require("node:fs");
fs.appendFileSync(process.env.PUBLISH_TEST_LOG, JSON.stringify({
  command: ${JSON.stringify(command)},
  args: process.argv.slice(2),
  hasGemKey: process.env.GEM_HOST_API_KEY === "temporary-test-key",
}) + "\\n");
process.exit(Number(process.env.PUBLISH_TEST_EXIT || "0"));
`, { mode: 0o755 });
  }
  return {
    package(name) {
      const path = join(packages, name);
      writeFileSync(path, "test artifact");
      return path;
    },
    run(extraEnv = {}) {
      const result = spawnSync("bash", [join(directory, sdk, "publish-sdk.sh")], {
        cwd: directory,
        encoding: "utf8",
        timeout: 10_000,
        // Do not inherit credentials, npm config, or GitHub output file paths.
        env: {
          PATH: `${bin}:${dirname(process.execPath)}:${process.env.PATH}`,
          PUBLISH_TEST_LOG: log,
          ...extraEnv,
        },
      });
      assert.ifError(result.error);
      return result;
    },
    commands() {
      return readFileSync(log, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
    },
  };
}

const npmPackages = [
  ["api-typescript", "trinsic-api-1.2.3-beta.1.tgz"],
  ["ui-web", "trinsic-web-ui-1.2.3-beta.1.tgz"],
  ["ui-expo", "trinsic-expo-ui-1.2.3-beta.1.tgz"],
];

for (const [sdk, filename] of npmPackages) {
  test(`${sdk} publishes its artifact without a stored npm token or login command`, (t) => {
    const f = fixture(t, sdk);
    const artifact = f.package(filename);
    f.package("unrelated-package.tgz");
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    const calls = f.commands();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].command, "npm");
    assert.deepEqual(calls[0].args.slice(0, 2), ["publish", artifact]);
    assert.ok(calls[0].args.includes("--access=public"));
    assert.ok(calls[0].args.includes("--registry=https://registry.npmjs.org"));
    assert.ok(calls[0].args.includes("--ignore-scripts"));
    const tagIndex = calls[0].args.indexOf("--tag");
    assert.notEqual(tagIndex, -1);
    assert.equal(calls[0].args[tagIndex + 1], "next");
  });

  test(`${sdk} rejects missing artifacts before invoking npm`, (t) => {
    const f = fixture(t, sdk);
    const result = f.run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /No npm packages found/);
    assert.deepEqual(f.commands(), []);
  });
}

for (const [sdk, filename] of npmPackages) {
  for (const version of ["1.2.3", "1.2.3+build-with-hyphens"]) {
    test(`${sdk} version ${version} retains the latest dist-tag`, (t) => {
      const f = fixture(t, sdk, version);
      f.package(filename.replace("1.2.3-beta.1", version));
      const result = f.run();
      assert.equal(result.status, 0, result.stderr);
      const args = f.commands()[0].args;
      const tagIndex = args.indexOf("--tag");
      assert.notEqual(tagIndex, -1);
      assert.equal(args[tagIndex + 1], "latest");
    });
  }
}

test("npm upload errors stop the release before another artifact is published", (t) => {
  const f = fixture(t, "ui-web");
  f.package("trinsic-web-ui-1.2.3.tgz");
  f.package("trinsic-web-ui-1.2.4.tgz");
  assert.equal(f.run({ PUBLISH_TEST_EXIT: "42" }).status, 42);
  assert.equal(f.commands().length, 1);
});

test("Ruby publishes with the temporary key without running gem signin", (t) => {
  const f = fixture(t, "api-ruby");
  const artifact = f.package("trinsic_api-1.2.3.gem");
  f.package("unrelated.gem");
  const result = f.run({ GEM_HOST_API_KEY: "temporary-test-key" });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(f.commands(), [{
    command: "gem",
    args: ["push", artifact, "--host", "https://rubygems.org"],
    hasGemKey: true,
  }]);
});

test("Ruby fails before pushing if the credential exchange did not provide a key", (t) => {
  const f = fixture(t, "api-ruby");
  f.package("trinsic_api-1.2.3.gem");
  const result = f.run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /GEM_HOST_API_KEY is required/);
  assert.deepEqual(f.commands(), []);
});

test("Ruby rejects missing artifacts before invoking gem", (t) => {
  const f = fixture(t, "api-ruby");
  const result = f.run({ GEM_HOST_API_KEY: "temporary-test-key" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /No RubyGems packages found/);
  assert.deepEqual(f.commands(), []);
});

test("Ruby upload errors stop the release before another artifact is published", (t) => {
  const f = fixture(t, "api-ruby");
  f.package("trinsic_api-1.2.3.gem");
  f.package("trinsic_api-1.2.4.gem");
  assert.equal(f.run({ GEM_HOST_API_KEY: "temporary-test-key", PUBLISH_TEST_EXIT: "42" }).status, 42);
  assert.equal(f.commands().length, 1);
});
