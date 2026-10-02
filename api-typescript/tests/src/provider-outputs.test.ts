import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import { readTestConfiguration } from "./config.js";
import {
  recordCompatibilityCase,
  recordSkippedCompatibilityCase,
} from "./results.js";

type JsonRecord = Record<string, unknown>;
type SdkModule = Record<string, unknown>;

interface ProviderOutputFixture {
  hasPublicSdkModel: boolean;
  providerId: string;
  sdkModelName?: string;
}

interface ProviderOutputConverters {
  fromJson: (json: unknown) => unknown;
  toJson: (value: unknown) => unknown;
}

const installRoot = requiredEnvironment("SDK_INSTALL_ROOT");
const isCurrentSdk = requiredEnvironment("SDK_IS_CURRENT") === "true";
const targetLabel = requiredEnvironment("SDK_TARGET_LABEL");
const configuration = readTestConfiguration();
const sdk = loadSdk(installRoot);

test(`${targetLabel}: provider-output fixtures round-trip through every supported generated model`, async () => {
  const fixtures = await recordCompatibilityCase(
    "serialization.provider-output-round-trip",
    fetchFixtureCatalog,
    { scope: "catalog" },
  );
  assert.ok(fixtures.length > 0, "expected Connect to expose provider-output fixtures");

  const failures: Error[] = [];

  for (const fixture of fixtures) {
    const parameters = {
      providerId: fixture.providerId,
    };

    if (!fixture.hasPublicSdkModel) {
      recordSkippedCompatibilityCase(
        "serialization.provider-output-round-trip",
        "Provider has no public Swagger provider-specific output model.",
        parameters,
        {
          code: "missing-public-provider-output",
          message: `${fixture.providerId} does not declare a public provider-specific output model for API SDKs.`,
        },
      );
      continue;
    }

    assert.ok(fixture.sdkModelName, `${fixture.providerId} is marked as public but has no SDK model name`);
    const modelParameters = { ...parameters, sdkModelName: fixture.sdkModelName };
    const converters = findConverters(fixture);
    if (!converters) {
      if (isCurrentSdk) {
        try {
          await recordCompatibilityCase(
            "serialization.provider-output-round-trip",
            async () => {
              assert.fail(
                `Connect declares ${fixture.providerId}'s ${fixture.sdkModelName} output as public, `
                + `but ${targetLabel} does not export ${fixture.sdkModelName}FromJSON and ${fixture.sdkModelName}ToJSON. `
                + "Expose the model in the target Swagger document and regenerate the SDK, "
                + "or mark the provider output as non-public in the fixture catalog.",
              );
            },
            modelParameters,
          );
        } catch (error) {
          failures.push(asError(error));
        }
      } else {
        recordSkippedCompatibilityCase(
          "serialization.provider-output-round-trip",
          "The published SDK does not expose this provider-output model.",
          modelParameters,
        );
      }
      continue;
    }

    try {
      await recordCompatibilityCase(
        "serialization.provider-output-round-trip",
        async () => {
          const rawOutput = await fetchFixture(fixture.providerId);
          const serializedOutput = jsonValue(converters.toJson(converters.fromJson(rawOutput)));

          if (isCurrentSdk) {
            assertJsonEquivalent(
              serializedOutput,
              rawOutput,
              `${fixture.providerId} (${fixture.sdkModelName})`,
            );
            return;
          }

          assertSerializedSubset(
            serializedOutput,
            rawOutput,
            `${fixture.providerId} (${fixture.sdkModelName})`,
          );
          if (Object.keys(rawOutput).length > 0) {
            const serializedFields = Object.keys(asRecord(serializedOutput, fixture.providerId));
            assert.ok(serializedFields.length > 0,
              `${targetLabel}'s ${fixture.sdkModelName} converter drops every top-level field `
              + `from the current ${fixture.providerId} fixture (${Object.keys(rawOutput).join(", ")}). `
              + "This published SDK cannot deserialize any supported portion of this provider output.",
            );
          }
        },
        modelParameters,
      );
    } catch (error) {
      failures.push(asError(error));
    }

  }

  if (failures.length > 0) {
    throw new AggregateError(failures, `${failures.length} provider-output fixture(s) failed.`);
  }
});

async function fetchFixtureCatalog(): Promise<ProviderOutputFixture[]> {
  const response = await globalThis.fetch(
    `${configuration.baseUrl}/api/v1/providers/sample-json/outputs`,
    { headers: authenticatedJsonHeaders() },
  );

  assert.equal(
    response.status,
    200,
    `Provider-output fixture catalog returned HTTP ${response.status}. `
    + "Verify that the selected Connect environment has the SDK test-support endpoint and accepts TRINSIC_TEST_ACCESS_TOKEN.",
  );
  const body = await response.json();
  assert.ok(Array.isArray(body), "expected the fixture catalog to be an array");

  return body.map((value, index) => {
    const fixture = asRecord(value, `fixture catalog entry ${index}`);
    assert.equal(typeof fixture.providerId, "string");
    assert.equal(
      typeof fixture.hasPublicSdkModel,
      "boolean",
      "Connect fixture catalog must return hasPublicSdkModel; deploy the SDK test-support endpoint update.",
    );
    assert.ok(
      !fixture.hasPublicSdkModel || typeof fixture.sdkModelName === "string",
      `Fixture catalog marks ${fixture.providerId} as a public SDK model but omits sdkModelName. `
      + "Connect must provide the generated model name for every public provider output.",
    );
    assert.ok(
      fixture.hasPublicSdkModel || fixture.sdkModelName === null || fixture.sdkModelName === undefined,
      `Fixture catalog marks ${fixture.providerId} as non-public but includes sdkModelName. `
      + "Mark it public or remove the model name so SDK compatibility tests can classify it correctly.",
    );

    return {
      hasPublicSdkModel: fixture.hasPublicSdkModel as boolean,
      providerId: fixture.providerId as string,
      ...(typeof fixture.sdkModelName === "string"
        ? { sdkModelName: fixture.sdkModelName }
        : {}),
    };
  });
}

async function fetchFixture(providerId: string): Promise<JsonRecord> {
  const response = await globalThis.fetch(
    `${configuration.baseUrl}/api/v1/providers/${encodeURIComponent(providerId)}/sample-json/output`,
    { headers: authenticatedJsonHeaders() },
  );

  assert.equal(
    response.status,
    200,
    `Provider-output fixture for ${providerId} returned HTTP ${response.status}. `
    + "Verify that the provider is present in the target environment and the test token is authorized.",
  );
  return asRecord(await response.json(), `${providerId} fixture`);
}

function authenticatedJsonHeaders(): Record<string, string> {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${configuration.accessToken}`,
  };
}

function findConverters(fixture: ProviderOutputFixture): ProviderOutputConverters | undefined {
  assert.ok(fixture.sdkModelName, `${fixture.providerId} has no SDK model name`);
  const fromJson = sdk[`${fixture.sdkModelName}FromJSON`];
  const toJson = sdk[`${fixture.sdkModelName}ToJSON`];

  if (typeof fromJson !== "function" || typeof toJson !== "function") {
    return undefined;
  }

  return {
    fromJson: fromJson as ProviderOutputConverters["fromJson"],
    toJson: toJson as ProviderOutputConverters["toJson"],
  };
}

function assertSerializedSubset(
  serialized: unknown,
  raw: unknown,
  path: string,
): void {
  if (serialized === null || typeof serialized !== "object") {
    assertJsonScalarEquivalent(serialized, raw, `${path} must preserve its scalar value`);
    return;
  }

  if (Array.isArray(serialized)) {
    assert.ok(
      Array.isArray(raw),
      `${path}: this SDK serializes the value as an array, but the current fixture has ${jsonType(raw)}. `
      + "That is an incompatible provider-output shape change for this SDK release.",
    );
    assert.equal(
      serialized.length,
      raw.length,
      `${path}: this SDK serializes ${serialized.length} items, but the current fixture has ${raw.length}. `
      + "That is an incompatible provider-output shape change for this SDK release.",
    );
    for (const [index, item] of serialized.entries()) {
      assertSerializedSubset(item, raw[index], `${path}[${index}]`);
    }
    return;
  }

  const serializedRecord = asRecord(serialized, path);
  assert.ok(
    raw !== null && typeof raw === "object" && !Array.isArray(raw),
    `${path}: this SDK serializes the value as an object, but the current fixture has ${jsonType(raw)}. `
    + "That is an incompatible provider-output shape change for this SDK release.",
  );
  const rawRecord = raw as JsonRecord;
  for (const [key, value] of Object.entries(serializedRecord)) {
    assert.ok(
      Object.hasOwn(rawRecord, key),
      `${path}.${key}: this SDK emits a field that is absent from the current fixture. `
      + "The provider-output wire contract no longer matches this SDK release.",
    );
    assertSerializedSubset(value, rawRecord[key], `${path}.${key}`);
  }
}

function assertJsonEquivalent(actual: unknown, expected: unknown, path: string): void {
  if (actual === null || typeof actual !== "object") {
    assertJsonScalarEquivalent(actual, expected, `${path} must preserve its scalar value`);
    return;
  }

  if (Array.isArray(actual)) {
    assert.ok(Array.isArray(expected), `${path}: SDK round-trip produced an array, but the wire fixture has ${jsonType(expected)}.`);
    assert.equal(actual.length, expected.length, `${path}: SDK round-trip changed the array length from ${expected.length} to ${actual.length}.`);
    for (const [index, item] of actual.entries()) {
      assertJsonEquivalent(item, expected[index], `${path}[${index}]`);
    }
    return;
  }

  const actualRecord = asRecord(actual, path);
  assert.ok(
    expected !== null && typeof expected === "object" && !Array.isArray(expected),
    `${path}: SDK round-trip produced an object, but the wire fixture has ${jsonType(expected)}.`,
  );
  const expectedRecord = expected as JsonRecord;
  const missingFields = Object.keys(expectedRecord).filter((key) => !Object.hasOwn(actualRecord, key));
  const unexpectedFields = Object.keys(actualRecord).filter((key) => !Object.hasOwn(expectedRecord, key));
  assert.equal(
    missingFields.length,
    0,
    `${path}: SDK round-trip drops wire field(s): ${missingFields.join(", ")}. `
    + "The generated model must preserve every field from this current provider-output fixture.",
  );
  assert.equal(
    unexpectedFields.length,
    0,
    `${path}: SDK round-trip adds field(s) not present on the wire: ${unexpectedFields.join(", ")}. `
    + "The generated model does not match this current provider-output fixture.",
  );
  for (const [key, value] of Object.entries(actualRecord)) {
    assertJsonEquivalent(value, expectedRecord[key], `${path}.${key}`);
  }
}

function assertJsonScalarEquivalent(actual: unknown, expected: unknown, message: string): void {
  if (typeof actual === "string" && typeof expected === "string") {
    const actualTimestamp = timestampMilliseconds(actual);
    const expectedTimestamp = timestampMilliseconds(expected);
    if (actualTimestamp !== undefined && expectedTimestamp !== undefined) {
      assert.equal(actualTimestamp, expectedTimestamp, message);
      return;
    }
  }

  assert.deepEqual(
    actual,
    expected,
    `${message}: SDK round-trip produced ${JSON.stringify(actual)}, but the wire fixture contains ${JSON.stringify(expected)}.`,
  );
}

function jsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "an array";
  if (typeof value === "undefined") return "undefined";
  if (typeof value === "object") return "an object";
  return `a ${typeof value}`;
}

function timestampMilliseconds(value: string): number | undefined {
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    )
  ) {
    return undefined;
  }

  const milliseconds = Date.parse(value);
  return Number.isNaN(milliseconds) ? undefined : milliseconds;
}

function jsonValue(value: unknown): unknown {
  const serialized = JSON.stringify(value);
  assert.notEqual(serialized, undefined, "generated ToJSON helper must return JSON data");
  return JSON.parse(serialized);
}

function asRecord(value: unknown, label: string): JsonRecord {
  assert.equal(typeof value, "object", `${label} must be an object`);
  assert.notEqual(value, null, `${label} must not be null`);
  assert.equal(Array.isArray(value), false, `${label} must not be an array`);
  return value as JsonRecord;
}

function loadSdk(root: string): SdkModule {
  const requireFromInstalledPackage = createRequire(`${root}/package.json`);
  return requireFromInstalledPackage("@trinsic/api") as SdkModule;
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be supplied by the compatibility test runner.`);
  }
  return value;
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
