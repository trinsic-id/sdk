#!/usr/bin/env node
import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readTestCases, target, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const selected = target();
let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-php-compat-", (directory) => {
    const composer = { repositories: selected.packagePath ? [{ type: "path", url: selected.packagePath, options: { symlink: false } }] : [], require: { "trinsic/api": selected.packagePath ? "*" : selected.version }, "require-dev": { "phpunit/phpunit": "^11.5" }, config: { "secure-http": true } };
    writeFileSync(join(directory, "composer.json"), `${JSON.stringify(composer, null, 2)}\n`);
    command("composer", ["update", "--no-interaction", "--no-progress", "--working-dir", directory]);
    const installed = JSON.parse(readFileSync(join(directory, "vendor/composer/installed.json")));
    const packageInfo = (installed.packages ?? installed).find((item) => item.name === "trinsic/api");
    if (!packageInfo?.version) throw new Error("Composer did not install trinsic/api.");
    const version = packageInfo.version;
    const output = join(directory, "target-results.json");
    cpSync(join(new URL(".", import.meta.url).pathname, "run_target.php"), join(directory, "run_target.php"));
    cpSync(join(new URL(".", import.meta.url).pathname, "CompatibilityTest.php"), join(directory, "CompatibilityTest.php"));
    command(join(directory, "vendor/bin/phpunit"), [join(directory, "CompatibilityTest.php")], { check: false, env: childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: version }) });
    return { sdkVersion: version, testCases: readTestCases(output) ?? failure("php", "PHP target exited before producing structured results.") };
  }));
} catch (error) { testCases = failure("php", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
