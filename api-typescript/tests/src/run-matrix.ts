import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  readCompatibilityMatrix,
  readTestConfiguration,
} from "./config.js";

interface TestTarget {
  assertionProfile: "current" | "published";
  isCurrent: boolean;
  label: string;
  packageSpecifier: string;
}

interface TestFile {
  name: string;
  path: string;
}

interface CompatibilityCaseResult {
  advisory?: {
    code: string;
    message: string;
  };
  durationMs: number;
  failure?: {
    message: string;
    name: string;
  };
  id: string;
  parameters?: Record<string, string>;
  skipReason?: string;
  status: "passed" | "failed" | "skipped";
}

interface TargetResult {
  isCurrent: boolean;
  label: string;
  sdkVersion?: string;
  setupFailure?: string;
  testCases: CompatibilityCaseResult[];
}

interface TestCatalog {
  schemaVersion: 1;
  testCases: Array<{
    id: string;
    kind?: string;
    operationId?: string;
    requiredLanguages: string[];
  }>;
}

interface ApiOperationCoverage {
  covered: boolean;
  method: string;
  operationId: string;
  path: string;
  testCaseIds: string[];
}

interface ApiCoverageReport {
  covered: number;
  operations: ApiOperationCoverage[];
  total: number;
  unmappedTestCaseIds: string[];
}

const testsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apiTypescriptRoot = resolve(testsRoot, "..");
const repositoryRoot = resolve(apiTypescriptRoot, "..");
const testFiles: TestFile[] = [
  { name: "read-apis", path: join(testsRoot, "src", "read-apis.test.ts") },
  { name: "session-lifecycle", path: join(testsRoot, "src", "session-lifecycle.test.ts") },
  { name: "recommendations", path: join(testsRoot, "src", "recommendations.test.ts") },
  { name: "provider-outputs", path: join(testsRoot, "src", "provider-outputs.test.ts") },
];

async function main(): Promise<void> {
  const configuration = readTestConfiguration();
  const matrix = await readCompatibilityMatrix(
    join(repositoryRoot, "compatibility.json"),
  );
  const publishedVersions = matrix.compatibility.sdkVersions.typescript;

  if (!publishedVersions) {
    throw new Error("Compatibility matrix does not define TypeScript SDK versions.");
  }

  const currentTarball = await findCurrentTarball();
  const targets: TestTarget[] = [
    {
      assertionProfile: "current",
      isCurrent: true,
      label: "current branch",
      packageSpecifier: currentTarball,
    },
    ...originMainTarget(),
    ...publishedVersions.toSorted(compareSdkVersionsDescending).map((version) => ({
      assertionProfile: "published" as const,
      isCurrent: false,
      label: `@trinsic/api@${version}`,
      packageSpecifier: `@trinsic/api@${version}`,
    })),
  ];

  const catalog = await readTestCatalog(join(repositoryRoot, "compatibility-tests.json"));
  const apiCoverage = await readApiCoverage(catalog);
  const targetResults: TargetResult[] = [];

  for (const target of targets) {
    targetResults.push(await runTarget(target, configuration));
  }

  for (const targetResult of targetResults) {
    validateTargetCoverage(targetResult, catalog);
  }

  const resultsPath = await writeAggregateResults(catalog, targetResults, apiCoverage);
  console.log(`\nStructured compatibility results: ${resultsPath}`);

  const failedTargets = targetResults.filter(targetFailed);
  if (failedTargets.length > 0) {
    throw new Error(
      `${failedTargets.length} SDK compatibility target${failedTargets.length === 1 ? "" : "s"} failed.`,
    );
  }
}

function compareSdkVersionsDescending(left: string, right: string): number {
  return right.localeCompare(left, undefined, { numeric: true });
}

function originMainTarget(): TestTarget[] {
  const tarball = process.env.SDK_ORIGIN_MAIN_TARBALL;
  if (!tarball) {
    return [];
  }

  const revision = process.env.SDK_ORIGIN_MAIN_REVISION;
  return [{
    assertionProfile: "current",
    isCurrent: true,
    label: revision ? `origin/main (${revision})` : "origin/main",
    packageSpecifier: tarball,
  }];
}

async function findCurrentTarball(): Promise<string> {
  const publishDirectory = join(apiTypescriptRoot, "sdk", "publish");
  let files: string[];

  try {
    files = await readdir(publishDirectory);
  } catch {
    throw new Error(
      "Current SDK tarball was not found. Run api-typescript/build-sdk.sh before test:matrix.",
    );
  }

  const tarballs = files
    .filter((file) => /^trinsic-api-.*\.tgz$/.test(file))
    .sort();

  if (tarballs.length !== 1) {
    throw new Error(
      `Expected exactly one current SDK tarball in ${publishDirectory}, found ${tarballs.length}.`,
    );
  }

  return join(publishDirectory, tarballs[0]);
}

async function runTarget(
  target: TestTarget,
  configuration: ReturnType<typeof readTestConfiguration>,
): Promise<TargetResult> {
  const installRoot = await mkdtemp(join(tmpdir(), "trinsic-api-compat-"));
  const targetResult: TargetResult = {
    isCurrent: target.isCurrent,
    label: target.label,
    testCases: [],
  };

  try {
    await writeFile(
      join(installRoot, "package.json"),
      `${JSON.stringify({ name: "trinsic-api-compat-install", private: true }, null, 2)}\n`,
    );
    try {
      await runCommand(
        npmCommand(),
        [
          "install",
          "--ignore-scripts",
          "--no-package-lock",
          "--no-save",
          target.packageSpecifier,
        ],
        installRoot,
      );
    } catch (error) {
      targetResult.setupFailure = errorMessage(error);
      return targetResult;
    }

    const sdkVersion = await readInstalledSdkVersion(installRoot);
    targetResult.sdkVersion = sdkVersion;
    console.log(`\n=== Testing ${target.label} (resolved ${sdkVersion}) ===`);

    for (const testFile of testFiles) {
      const resultPath = join(installRoot, `${testFile.name}.result.json`);

      try {
        await runCommand(
          process.execPath,
          ["--use-system-ca", "--import", "tsx", "--test", testFile.path],
          testsRoot,
          {
            ...process.env,
            SDK_COMPATIBILITY_RESULT_FILE: resultPath,
            SDK_INSTALL_ROOT: installRoot,
            SDK_IS_CURRENT: String(target.isCurrent),
            SDK_TARGET_LABEL: target.label,
            SDK_VERSION: sdkVersion,
            TRINSIC_TEST_ACCESS_TOKEN: configuration.accessToken,
            TRINSIC_TEST_BASE_URL: configuration.baseUrl,
            TRINSIC_TEST_VERIFICATION_PROFILE_ID: configuration.verificationProfileId,
          },
        );
      } catch (error) {
        console.error(`\n${target.label}: ${testFile.name} failed: ${errorMessage(error)}`);
      }

      const testResult = await readTestFileResult(resultPath);
      if (testResult) {
        targetResult.testCases.push(...testResult);
      } else {
        targetResult.testCases.push({
          durationMs: 0,
          failure: {
            message: `${testFile.name} exited before producing structured results.`,
            name: "TestRunnerError",
          },
          id: `framework.${testFile.name}`,
          status: "failed",
        });
      }
    }

    return targetResult;
  } finally {
    await rm(installRoot, { force: true, recursive: true });
  }
}

async function readTestFileResult(
  path: string,
): Promise<CompatibilityCaseResult[] | undefined> {
  try {
    const parsed = JSON.parse(await readFile(path, "utf8")) as {
      schemaVersion?: unknown;
      testCases?: unknown;
    };

    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.testCases)) {
      return undefined;
    }

    return parsed.testCases as CompatibilityCaseResult[];
  } catch {
    return undefined;
  }
}

function validateTargetCoverage(target: TargetResult, catalog: TestCatalog): void {
  const expectedCaseIds = catalog.testCases
    .filter((testCase) => testCase.requiredLanguages.includes("typescript"))
    .map((testCase) => testCase.id);
  const actualCaseIds = new Set(target.testCases.map((testCase) => testCase.id));
  const missingCaseIds = expectedCaseIds.filter((id) => !actualCaseIds.has(id));

  if (missingCaseIds.length > 0) {
    target.testCases.push({
      durationMs: 0,
      failure: {
        message: `Missing required TypeScript test cases: ${missingCaseIds.join(", ")}.`,
        name: "CoverageError",
      },
      id: "framework.catalog-coverage",
      status: "failed",
    });
  }
}

async function readTestCatalog(path: string): Promise<TestCatalog> {
  const parsed = JSON.parse(await readFile(path, "utf8")) as TestCatalog;
  if (
    parsed.schemaVersion !== 1 ||
    !Array.isArray(parsed.testCases) ||
    parsed.testCases.some(
      (testCase) =>
        typeof testCase.id !== "string" || !Array.isArray(testCase.requiredLanguages),
    )
  ) {
    throw new Error(`Invalid compatibility test catalog at ${path}.`);
  }

  return parsed;
}

async function writeAggregateResults(
  catalog: TestCatalog,
  targets: TargetResult[],
  apiCoverage: ApiCoverageReport | undefined,
): Promise<string> {
  const path = resolve(
    process.env.SDK_COMPATIBILITY_RESULTS_PATH
      ?? join(testsRoot, ".results", "compatibility.json"),
  );
  await mkdir(dirname(path), { recursive: true });
  await writeFile(
    path,
    `${JSON.stringify(
      {
        $schema: "https://trinsic.id/schemas/sdk-compatibility-results-v1.json",
        schemaVersion: 1,
        run: {
          generatedAt: new Date().toISOString(),
          ...(process.env.TRINSIC_TEST_ENVIRONMENT
            ? { environment: process.env.TRINSIC_TEST_ENVIRONMENT }
            : {}),
          targetBaseUrl: readTestConfiguration().baseUrl,
        },
        suite: { language: "typescript" },
        testCatalog: catalog.testCases,
        ...(apiCoverage ? { apiCoverage } : {}),
        targets,
      },
      null,
      2,
    )}\n`,
  );
  return path;
}

async function readApiCoverage(catalog: TestCatalog): Promise<ApiCoverageReport | undefined> {
  const specPath = process.env.SDK_COMPATIBILITY_OPENAPI_SPEC;
  if (!specPath) {
    return undefined;
  }

  const parsed = JSON.parse(await readFile(specPath, "utf8")) as unknown;
  if (!isRecord(parsed) || !isRecord(parsed.paths)) {
    throw new Error(`OpenAPI specification at ${specPath} has no paths object.`);
  }

  const testCaseIdsByOperation = new Map<string, string[]>();
  for (const testCase of catalog.testCases) {
    if (testCase.kind !== "api-operation" || typeof testCase.operationId !== "string") {
      continue;
    }

    const testCaseIds = testCaseIdsByOperation.get(testCase.operationId) ?? [];
    testCaseIds.push(testCase.id);
    testCaseIdsByOperation.set(testCase.operationId, testCaseIds);
  }

  const operationIds = new Set<string>();
  const operations: ApiOperationCoverage[] = [];
  for (const [path, pathItem] of Object.entries(parsed.paths)) {
    if (!isRecord(pathItem)) {
      continue;
    }

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!isHttpMethod(method) || !isRecord(operation) || typeof operation.operationId !== "string") {
        continue;
      }

      const operationId = operation.operationId;
      operationIds.add(operationId);
      const testCaseIds = testCaseIdsByOperation.get(operationId) ?? [];
      operations.push({
        covered: testCaseIds.length > 0,
        method: method.toUpperCase(),
        operationId,
        path,
        testCaseIds,
      });
    }
  }

  operations.sort((left, right) =>
    left.path.localeCompare(right.path) || left.method.localeCompare(right.method),
  );

  return {
    covered: operations.filter((operation) => operation.covered).length,
    operations,
    total: operations.length,
    unmappedTestCaseIds: catalog.testCases
      .filter((testCase) => testCase.kind === "api-operation")
      .filter((testCase) => !operationIds.has(testCase.operationId ?? ""))
      .map((testCase) => testCase.id),
  };
}

function targetFailed(target: TargetResult): boolean {
  return Boolean(target.setupFailure) || target.testCases.some((testCase) => testCase.status === "failed");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function readInstalledSdkVersion(installRoot: string): Promise<string> {
  const packageJsonPath = join(
    installRoot,
    "node_modules",
    "@trinsic",
    "api",
    "package.json",
  );
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    version?: unknown;
  };

  if (typeof packageJson.version !== "string") {
    throw new Error("Installed @trinsic/api package has no string version.");
  }

  return packageJson.version;
}

function npmCommand(): string {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function isHttpMethod(value: string): boolean {
  return ["delete", "get", "head", "options", "patch", "post", "put"].includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function runCommand(
  command: string,
  args: string[],
  cwd: string,
  environment: NodeJS.ProcessEnv = process.env,
): Promise<void> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd,
      env: environment,
      stdio: "inherit",
    });

    child.once("error", rejectPromise);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      rejectPromise(
        new Error(
          `${command} ${args.join(" ")} exited with ${
            signal ? `signal ${signal}` : `code ${code ?? "unknown"}`
          }.`,
        ),
      );
    });
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Compatibility test runner failed: ${message}`);
  process.exitCode = 1;
});
