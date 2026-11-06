import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "./results.js";
import { asRecord, requiredEnvironment, sdk, targetLabel, type JsonRecord } from "./support.js";

import {
  recordCompatibilityCase,
  recordSkippedCompatibilityCase,
} from "./results.js";

interface ProviderOutputFixture {
  hasPublicSdkModel: boolean;
  providerId: string;
  sdkModelName?: string;
  output?: JsonRecord;
  serializationOutput?: JsonRecord;
  testCaseId?: string;
}

interface ProviderOutputConverters {
  fromJson: (json: unknown) => unknown;
  toJson: (value: unknown) => unknown;
}

test(`${targetLabel}: provider-output fixtures round-trip through every supported generated model`, async () => {
  const fixtures = await recordCompatibilityCase(
    "serialization.provider-output-round-trip",
    async () => JSON.parse(await readFile(requiredEnvironment("SDK_COMPATIBILITY_PSO_FIXTURES_PATH"), "utf8")).fixtures as ProviderOutputFixture[],
    { scope: "catalog" },
  );
  assert.ok(fixtures.length > 0, "expected Connect to expose provider-output fixtures");

  const failures: Error[] = [];

  for (const fixture of fixtures) {
    const caseId = fixture.testCaseId ?? "serialization.provider-output-round-trip";
    const parameters = {
      providerId: fixture.providerId,
    };

    if (!fixture.hasPublicSdkModel) {
      recordSkippedCompatibilityCase(
        caseId,
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
      recordSkippedCompatibilityCase(caseId, "Model is not exported by this SDK release.", modelParameters);
      continue;
    }

    try {
      await recordCompatibilityCase(
        caseId,
        async () => {
          const rawOutput = asRecord(fixture.output, `${fixture.providerId} fixture`);
          const serializationExpected = fixture.serializationOutput ?? rawOutput;
          const serializedOutput = jsonValue(converters.toJson(converters.fromJson(rawOutput)));

          const exact = !!fixture.testCaseId;
          assertJsonEquivalent(serializedOutput, serializationExpected, `${fixture.providerId} (${fixture.sdkModelName})`, exact);
          if (exact) return;

          if (Object.keys(serializationExpected).length > 0) {
            const serializedFields = Object.keys(asRecord(serializedOutput, fixture.providerId));
            assert.ok(serializedFields.length > 0,
              `${targetLabel}'s ${fixture.sdkModelName} converter drops every top-level field `
              + `from the current ${fixture.providerId} fixture (${Object.keys(serializationExpected).join(", ")}). `
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

function findConverters(fixture: ProviderOutputFixture): ProviderOutputConverters | undefined {
  assert.ok(fixture.sdkModelName, `${fixture.providerId} has no SDK model name`);
  const fromJson = (sdk as Record<string, unknown>)[`${fixture.sdkModelName}FromJSON`];
  const toJson = (sdk as Record<string, unknown>)[`${fixture.sdkModelName}ToJSON`];

  if (fromJson === undefined && toJson === undefined) {
    return undefined;
  }
  assert.equal(typeof fromJson, "function", `${fixture.sdkModelName} is missing its FromJSON converter`);
  assert.equal(typeof toJson, "function", `${fixture.sdkModelName} is missing its ToJSON converter`);

  return {
    fromJson: fromJson as ProviderOutputConverters["fromJson"],
    toJson: toJson as ProviderOutputConverters["toJson"],
  };
}

function assertJsonEquivalent(actual: unknown, expected: unknown, path: string, exact: boolean): void {
  if (actual === null || typeof actual !== "object") {
    assertJsonScalarEquivalent(actual, expected, `${path} must preserve its scalar value`);
    return;
  }

  if (Array.isArray(actual)) {
    assert.ok(Array.isArray(expected), `${path}: SDK round-trip produced an array, but the wire fixture has ${jsonType(expected)}.`);
    assert.equal(actual.length, expected.length, `${path}: SDK round-trip changed the array length from ${expected.length} to ${actual.length}.`);
    for (const [index, item] of actual.entries()) {
      assertJsonEquivalent(item, expected[index], `${path}[${index}]`, exact);
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
  assert.equal(
    exact ? missingFields.length : 0,
    0,
    `${path}: SDK round-trip drops wire field(s): ${missingFields.join(", ")}. `
    + "The generated model must preserve every field from this current provider-output fixture.",
  );
  for (const [key, value] of Object.entries(actualRecord)) {
    if (Object.hasOwn(expectedRecord, key)) {
      assertJsonEquivalent(value, expectedRecord[key], `${path}.${key}`, exact);
    }
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

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
