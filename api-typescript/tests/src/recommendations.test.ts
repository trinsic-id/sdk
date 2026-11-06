import assert from "node:assert/strict";
import test from "node:test";
import { asRecord, asRecordArray, captureRequests, configuration, headerValue, isCurrentSdk, recordIds, sdk, sdkVersion, targetLabel, type JsonRecord } from "./support.js";

import {
  MINIMUM_SDK_VERSION,
  RECOMMEND_PROVIDER_REQUIRED_STRING_ARRAY_FIELDS,
  RECOMMEND_PROVIDER_REQUIRED_STRING_FIELDS,
  SUB_PROVIDER_REQUIRED_STRING_FIELDS,
} from "./contracts.js";
import { isSdkVersionAtLeast } from "./config.js";
import { recordCompatibilityCase } from "./results.js";

test(`${targetLabel}: RecommendProviders serializes and deserializes its supported contract`, () => recordCompatibilityCase(
  "api.sessions.recommend-providers",
  async () => {
  const { requests: capturedRequests, config } = captureRequests();
  const result = await new sdk.SessionsApi(config).recommendProviders({
    health: "All",
    verificationProfileId: configuration.verificationProfileId,
  });

  assert.equal(capturedRequests.length, 1, "expected one Recommendations request");
  const captured = capturedRequests[0];
  assert.equal(captured.method, "POST");
  assert.equal(
    new URL(captured.url).pathname,
    "/api/v1/sessions/providers/recommend",
  );
  assert.ok(
    headerValue(captured.headers, "authorization") ===
      `Bearer ${configuration.accessToken}`,
    "expected the SDK to attach the configured developer authentication",
  );
  assert.deepEqual(captured.body, {
    health: "All",
    verificationProfileId: configuration.verificationProfileId,
  });

  const rawResponse = asRecord(captured.responseJson, "Recommendations response");
  const rawRecommended = asRecordArray(
    rawResponse.recommendedProviders,
    "Recommendations response.recommendedProviders",
  );
  const rawRemainder = optionalRecordArray(rawResponse.remainder);
  assert.ok(
    rawRecommended.length + rawRemainder.length > 0,
    "expected the test verification profile to expose at least one provider",
  );

  // The provider-information fields are read-only, so OpenAPI Generator
  // intentionally omits them from its ToJSON helper. Compare deserialized
  // values to the captured wire response instead of reserializing that model.
  const deserializedRecommended = asRecordArray(
    result.recommendedProviders,
    "SDK Recommendations response.recommendedProviders",
  );

  if (isCurrentSdk) {
    const deserializedRemainder = asRecordArray(
      result.remainder,
      "SDK Recommendations response.remainder",
    );
    assertCurrentRecommendationResponseShape(
      rawRecommended,
      deserializedRecommended,
      "recommendedProviders",
    );
    assertCurrentRecommendationResponseShape(
      rawRemainder,
      deserializedRemainder,
      "remainder",
    );
    return;
  }

  assert.deepEqual(recordIds(deserializedRecommended), recordIds(rawRecommended));

  if (
    isSdkVersionAtLeast(
      sdkVersion,
      MINIMUM_SDK_VERSION.recommendProvidersRemainder,
    )
  ) {
    const resultRemainder = asRecordArray(
      result.remainder,
      "SDK Recommendations response.remainder",
    );
    assert.deepEqual(recordIds(resultRemainder), recordIds(rawRemainder));
  }
  },
));

function optionalRecordArray(value: unknown): JsonRecord[] {
  return value === undefined ? [] : asRecordArray(value, "Recommendations response.remainder");
}

function assertCurrentRecommendationResponseShape(
  rawProviders: JsonRecord[],
  deserializedProviders: JsonRecord[],
  listName: string,
): void {
  assert.equal(
    deserializedProviders.length,
    rawProviders.length,
    `SDK ${listName} must preserve every provider in the response`,
  );

  for (const [index, rawProvider] of rawProviders.entries()) {
    const deserializedProvider = deserializedProviders[index];
    const providerLabel = `${listName}[${index}]`;

    for (const field of RECOMMEND_PROVIDER_REQUIRED_STRING_FIELDS) {
      assert.equal(
        typeof rawProvider[field],
        "string",
        `${providerLabel}.${field} must be a string on the wire`,
      );
      assert.equal(
        deserializedProvider[field],
        rawProvider[field],
        `SDK must deserialize ${providerLabel}.${field}`,
      );
    }

    for (const field of RECOMMEND_PROVIDER_REQUIRED_STRING_ARRAY_FIELDS) {
      assertStringArray(rawProvider[field], `${providerLabel}.${field}`);
      assert.deepEqual(
        deserializedProvider[field],
        rawProvider[field],
        `SDK must deserialize ${providerLabel}.${field}`,
      );
    }

    const rawSubProviders = rawProvider.subProviders;
    if (rawSubProviders === undefined || rawSubProviders === null) {
      assert.equal(
        deserializedProvider.subProviders,
        undefined,
        `SDK must represent an absent or null ${providerLabel}.subProviders as undefined`,
      );
      continue;
    }

    const deserializedSubProviders = asRecordArray(
      deserializedProvider.subProviders,
      `SDK ${providerLabel}.subProviders`,
    );
    const rawSubProviderRecords = asRecordArray(
      rawSubProviders,
      `${providerLabel}.subProviders`,
    );
    assert.equal(deserializedSubProviders.length, rawSubProviderRecords.length);

    for (const [subProviderIndex, rawSubProvider] of rawSubProviderRecords.entries()) {
      const deserializedSubProvider = deserializedSubProviders[subProviderIndex];
      const subProviderLabel = `${providerLabel}.subProviders[${subProviderIndex}]`;

      for (const field of SUB_PROVIDER_REQUIRED_STRING_FIELDS) {
        assert.equal(
          typeof rawSubProvider[field],
          "string",
          `${subProviderLabel}.${field} must be a string on the wire`,
        );
        assert.equal(
          deserializedSubProvider[field],
          rawSubProvider[field],
          `SDK must deserialize ${subProviderLabel}.${field}`,
        );
      }

      const rawDarkModeLogoUrl = rawSubProvider.darkModeLogoUrl;
      if (rawDarkModeLogoUrl === undefined || rawDarkModeLogoUrl === null) {
        assert.equal(deserializedSubProvider.darkModeLogoUrl, undefined);
      } else {
        assert.equal(typeof rawDarkModeLogoUrl, "string");
        assert.equal(deserializedSubProvider.darkModeLogoUrl, rawDarkModeLogoUrl);
      }
    }
  }
}

function assertStringArray(value: unknown, label: string): asserts value is string[] {
  assert.ok(Array.isArray(value), `${label} must be an array`);
  for (const [index, item] of value.entries()) {
    assert.equal(typeof item, "string", `${label}[${index}] must be a string`);
  }
}
