import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

for (const [patchVersion, expectedTag] of [
  ["0-alpha1", "next"],
  ["0-beta.1", "next"],
  ["0-rc.1+build-123", "next"],
  ["0", "latest"],
  ["1", "latest"],
  ["0+build-123", "latest"],
]) {
  test(`TypeScript 3.3.${patchVersion} publishes under ${expectedTag}`, async (t) => {
    await mkdir(join(root, ".context"), { recursive: true });
    const directory = await mkdtemp(join(root, ".context/npm-publish-test-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const publishDirectory = join(directory, "api-typescript/sdk/publish");
    const bin = join(directory, "bin");
    await mkdir(publishDirectory, { recursive: true });
    await mkdir(join(directory, "helpers"));
    await mkdir(bin);
    for (const file of ["api-typescript/publish-sdk.sh", "helpers/common.sh", "get-version.sh"]) {
      await copyFile(join(root, file), join(directory, file));
    }
    await writeFile(join(directory, "versions.json"), JSON.stringify({
      backendVersion: "3.3",
      nodePatchVersion: patchVersion,
    }));
    const archive = join(publishDirectory, `trinsic-api-3.3.${patchVersion}.tgz`);
    // npm is stubbed: the fixture is never uploaded or unpacked.
    await writeFile(archive, "fixture");
    const callsFile = join(directory, "npm-calls.jsonl");
    await writeFile(join(bin, "npm"), `#!/usr/bin/env node
const { appendFileSync } = require("node:fs");
const args = process.argv.slice(2);
if (!["set", "whoami", "publish"].includes(args[0])) process.exit(1);
appendFileSync(process.env.NPM_TEST_CALLS, JSON.stringify(args) + "\\n");
`, { mode: 0o755 });

    const result = spawnSync("bash", [join(directory, "api-typescript/publish-sdk.sh")], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
      env: {
        ...process.env,
        PATH: `${bin}:${dirname(process.execPath)}:${process.env.PATH}`,
        NPM_TOKEN: "test-token",
        NPM_TEST_CALLS: callsFile,
      },
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    const calls = (await readFile(callsFile, "utf8")).trim().split("\n").map(JSON.parse);
    assert.deepEqual(calls.filter(([command]) => command === "publish"), [
      ["publish", archive, "--access=public", "--tag", expectedTag],
    ]);
  });
}
