#!/usr/bin/env node
import { cpSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readProcessTestCases, SDK_VERSION, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

let sdkVersion, testCases;
try {
  ({ sdkVersion, testCases } = temporaryDirectory("trinsic-ruby-compat-", (directory) => {
    const gemLine = `gem 'trinsic_api', "${SDK_VERSION}"`;
    writeFileSync(join(directory, "Gemfile"), `source 'https://rubygems.org'\ngem 'minitest', '~> 5.25'\n${gemLine}\n`);
    const output = join(directory, "target-results.json");
    const env = childEnvironment({ BUNDLE_GEMFILE: join(directory, "Gemfile"), SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION });
    const installed = command("bundle", ["install", "--quiet"], { env, check: false });
    const version = installed.status === 0 ? command("bundle", ["exec", "ruby", "-r", "trinsic_api", "-e", "puts TrinsicApi::VERSION"], { env }).stdout.trim() : SDK_VERSION;
    if (version) env.SDK_VERSION = version;
    cpSync(join(new URL(".", import.meta.url).pathname, "CompatibilitySupport.rb"), join(directory, "CompatibilitySupport.rb"));
    cpSync(join(new URL(".", import.meta.url).pathname, "compatibility_test.rb"), join(directory, "compatibility_test.rb"));
    cpSync(join(new URL(".", import.meta.url).pathname, "harness_regression_test.rb"), join(directory, "harness_regression_test.rb"));
    // One native run preserves harness failures alongside SDK outcomes.
    const execution = installed.status === 0 ? command("bundle", ["exec", "ruby", "-r", join(directory, "harness_regression_test.rb"), join(directory, "compatibility_test.rb"), ...(process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["--name", "/provider_outputs|HarnessRegressionTest/"] : [])], { env, check: false }) : installed;
    return { sdkVersion: version, testCases: readProcessTestCases(output, execution, "ruby", installed.status === 0 ? "Ruby target" : "Bundler install") };
  }));
} catch (error) { testCases = failure("ruby", error instanceof Error ? error.message : String(error)); }
writeExecutorResult({ sdkVersion, testCases });
