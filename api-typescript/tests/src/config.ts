import { readFile } from "node:fs/promises";

export interface TestConfiguration {
  accessToken: string;
  baseUrl: string;
  verificationProfileId: string;
}

export interface CompatibilityMatrix {
  compatibility: {
    sdkVersions: Record<string, string[]>;
  };
}

const REQUIRED_ENVIRONMENT_VARIABLES = [
  "TRINSIC_TEST_BASE_URL",
  "TRINSIC_TEST_ACCESS_TOKEN",
  "TRINSIC_TEST_VERIFICATION_PROFILE_ID",
] as const;

export function readTestConfiguration(
  environment: NodeJS.ProcessEnv = process.env,
): TestConfiguration {
  const missing = REQUIRED_ENVIRONMENT_VARIABLES.filter(
    (name) => !environment[name]?.trim(),
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required test configuration: ${missing.join(", ")}.`,
    );
  }

  return {
    accessToken: environment.TRINSIC_TEST_ACCESS_TOKEN!.trim(),
    baseUrl: normalizeBaseUrl(environment.TRINSIC_TEST_BASE_URL!),
    verificationProfileId: environment.TRINSIC_TEST_VERIFICATION_PROFILE_ID!.trim(),
  };
}

export function normalizeBaseUrl(value: string): string {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error("TRINSIC_TEST_BASE_URL must be an absolute HTTP(S) URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("TRINSIC_TEST_BASE_URL must use HTTP or HTTPS.");
  }

  return parsed.toString().replace(/\/+$/, "");
}

export async function readCompatibilityMatrix(
  path: string,
): Promise<CompatibilityMatrix> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read compatibility matrix at ${path}: ${String(error)}`);
  }

  if (!isCompatibilityMatrix(parsed)) {
    throw new Error(
      "Compatibility matrix must contain compatibility.sdkVersions with version arrays.",
    );
  }

  return parsed;
}

export function isSdkVersionAtLeast(version: string, minimum: string): boolean {
  const actualParts = parseStableVersion(version);
  const minimumParts = parseStableVersion(minimum);

  for (let index = 0; index < actualParts.length; index += 1) {
    if (actualParts[index] !== minimumParts[index]) {
      return actualParts[index] > minimumParts[index];
    }
  }

  return true;
}

function isCompatibilityMatrix(value: unknown): value is CompatibilityMatrix {
  if (!isRecord(value) || !isRecord(value.compatibility)) {
    return false;
  }

  const sdkVersions = value.compatibility.sdkVersions;
  if (!isRecord(sdkVersions)) {
    return false;
  }

  return Object.values(sdkVersions).every(
    (versions) =>
      Array.isArray(versions) &&
      versions.length > 0 &&
      versions.every(
        (version) =>
          typeof version === "string" &&
          /^v?\d+\.\d+\.\d+$/.test(version),
      ),
  );
}

function parseStableVersion(version: string): [number, number, number] {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`Expected a stable semantic version, received ${version}.`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
