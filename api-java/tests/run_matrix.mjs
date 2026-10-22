#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { childEnvironment, command, failure, readTestCases, target, temporaryDirectory, writeExecutorResult } from "../../scripts/sdk-compatibility/executor-helpers.mjs";

const tests = new URL(".", import.meta.url).pathname;
const selected = target();
let result;
try {
  result = temporaryDirectory("trinsic-java-compat-", (directory) => {
    const source = join(directory, "runner"); cpSync(tests, source, { recursive: true, filter: path => !path.includes("target") && !path.includes(".results") && !path.endsWith("run_matrix.mjs") && !path.endsWith("run-compatibility.sh") });
    const repository = join(directory, "m2"); mkdirSync(repository);
    const gradleHome = join(directory, "gradle");
    let groupId = "com.github.trinsic-id", artifactId = "sdk-java-api", version = selected.version;
    if (selected.packagePath) {
      const gradlew = join(selected.packagePath, "gradlew");
      if (!existsSync(gradlew)) throw new Error(`Generated Java target ${selected.label} has no Gradle wrapper at ${gradlew}.`);
      command(gradlew, ["-p", selected.packagePath, `-Dmaven.repo.local=${repository}`, "publishToMavenLocal"], { env: childEnvironment({ GRADLE_USER_HOME: gradleHome }) });
      groupId = "id.trinsic"; artifactId = "api";
      const artifactDirectory = join(repository, "id", "trinsic", "api");
      if (!existsSync(artifactDirectory)) throw new Error(`Generated Java target ${selected.label} did not publish id.trinsic:api into the isolated Maven repository.`);
      const versions = readdirSync(artifactDirectory).filter(candidate => existsSync(join(artifactDirectory, candidate, `api-${candidate}.pom`)) && existsSync(join(artifactDirectory, candidate, `api-${candidate}.jar`)));
      if (versions.length !== 1) throw new Error(`Generated Java target ${selected.label} published an ambiguous artifact set into the isolated Maven repository: ${versions.join(", ") || "none"}.`);
      version = versions[0];
    }
    if (!version) throw new Error(`Java target ${selected.label} did not provide an SDK version.`);
    const output = join(directory, "target-results.json");
    const env = childEnvironment({ SDK_COMPATIBILITY_RESULT_FILE: output, SDK_VERSION: version, MAVEN_OPTS: `-Dmaven.repo.local=${repository}` });
    const execution = command("mvn", ["-q", `-Dmaven.repo.local=${repository}`, "-f", join(source, "pom.xml"), "test", `-Dtrinsic.api.groupId=${groupId}`, `-Dtrinsic.api.artifactId=${artifactId}`, `-Dtrinsic.api.version=${version}`], { env, check: false });
    return { sdkVersion: version, testCases: readTestCases(output) ?? failure("java", `Java target exited with code ${execution.status ?? "unknown"} before producing structured results.`) };
  });
} catch (error) { result = { testCases: failure("java", error instanceof Error ? error.message : String(error)) }; }
writeExecutorResult(result);
