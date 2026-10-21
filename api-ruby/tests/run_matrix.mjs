#!/usr/bin/env node
import { cpSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readTestCases, target, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const selected = target();
let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-ruby-compat-", (directory) => {
    const source = selected.packagePath || selected.version;
    const gemLine = selected.packagePath ? `gem 'trinsic_api', path: ${JSON.stringify(selected.packagePath)}` : `gem 'trinsic_api', ${JSON.stringify(selected.version)}`;
    writeFileSync(join(directory, "Gemfile"), `source 'https://rubygems.org'\ngem 'minitest', '~> 5.25'\n${gemLine}\n`);
    const output = join(directory, "target-results.json");
    const env = childEnvironment({ BUNDLE_GEMFILE: join(directory, "Gemfile"), SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: selected.version ?? "3.2.1" });
    const installed = command("bundle", ["install", "--quiet"], { env, check: false });
    cpSync(join(new URL(".", import.meta.url).pathname, "run_target.rb"), join(directory, "run_target.rb"));
    cpSync(join(new URL(".", import.meta.url).pathname, "compatibility_test.rb"), join(directory, "compatibility_test.rb"));
    if (installed.status === 0) command("bundle", ["exec", "ruby", join(directory, "compatibility_test.rb")], { env, check: false });
    return { sdkVersion: selected.version, testCases: readTestCases(output) ?? failure("ruby", installed.status === 0 ? "Ruby target exited before producing structured results." : "Bundler could not install this Ruby SDK target.") };
  }));
} catch (error) { testCases = failure("ruby", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
