#!/usr/bin/env node
import { cpSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readProcessTestCases, target, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

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
    const version = installed.status === 0 ? command("bundle", ["exec", "ruby", "-r", "trinsic_api", "-e", "puts TrinsicApi::VERSION"], { env }).stdout.trim() : selected.version;
    if (version) env.SDK_VERSION = version;
    cpSync(join(new URL(".", import.meta.url).pathname, "CompatibilitySupport.rb"), join(directory, "CompatibilitySupport.rb"));
    cpSync(join(new URL(".", import.meta.url).pathname, "compatibility_test.rb"), join(directory, "compatibility_test.rb"));
    const execution = installed.status === 0 ? command("bundle", ["exec", "ruby", join(directory, "compatibility_test.rb"), ...(process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["--name", "/provider_outputs/"] : [])], { env, check: false }) : installed;
    return { sdkVersion: version, testCases: readProcessTestCases(output, execution, "ruby", installed.status === 0 ? "Ruby target" : "Bundler install") };
  }));
} catch (error) { testCases = failure("ruby", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
