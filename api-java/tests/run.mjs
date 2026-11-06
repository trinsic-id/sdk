#!/usr/bin/env node
import { cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readNativeTestCases, SDK_VERSION, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const tests = new URL(".", import.meta.url).pathname;
let result;
try {
  result = temporaryDirectory("trinsic-java-compat-", (directory) => {
    const source = join(directory, "runner"); cpSync(tests, source, { recursive: true, filter: path => !path.includes("target") && !path.includes(".results") && !path.endsWith("run.mjs") });
    const repository = join(directory, "m2"); mkdirSync(repository);
    const output = join(directory, "target-results.json");
    const env = childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION, MAVEN_OPTS: `-Dmaven.repo.local=${repository}` });
    const execution = command("mvn", ["-q", ...(process.env.SDK_COMPATIBILITY_TEST_SCOPE === "serialization" ? ["-Dtest=CompatibilityTest#providerOutputRoundTrips,CompatibilityHarnessTest"] : []), `-Dmaven.repo.local=${repository}`, "-f", join(source, "pom.xml"), "test"], { env, check: false });
    return { sdkVersion: SDK_VERSION, testCases: readNativeTestCases(output, execution, "java", "junit", join(source, "target/surefire-reports")) };
  });
} catch (error) { result = { testCases: failure("java", error instanceof Error ? error.message : String(error)) }; }
writeExecutorResult(result);
