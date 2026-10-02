import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import {
  MINIMUM_SDK_VERSION,
  RECOMMEND_PROVIDER_REQUIRED_STRING_ARRAY_FIELDS,
  RECOMMEND_PROVIDER_REQUIRED_STRING_FIELDS,
  SUB_PROVIDER_REQUIRED_STRING_FIELDS,
} from "./contracts.js";
import { isSdkVersionAtLeast, readTestConfiguration } from "./config.js";
import { recordCompatibilityCase } from "./results.js";

type JsonRecord = Record<string, unknown>;
type SdkModule = Record<string, any>;

interface CapturedRequest {
  body: unknown;
  headers: HeadersInit | undefined;
  method: string | undefined;
  responseJson: unknown;
  responseStatus: number;
  url: string;
}

const installRoot = requiredEnvironment("SDK_INSTALL_ROOT");
const isCurrentSdk = requiredEnvironment("SDK_IS_CURRENT") === "true";
const sdkVersion = requiredEnvironment("SDK_VERSION");
const targetLabel = requiredEnvironment("SDK_TARGET_LABEL");
const configuration = readTestConfiguration();
const sdk = loadSdk(installRoot);

test(`${targetLabel}: RecommendProviders serializes and deserializes its supported contract`, () => recordCompatibilityCase(
  "api.sessions.recommend-providers",
  async () => {
  const capturedRequests: CapturedRequest[] = [];
  const originalFetch = globalThis.fetch.bind(globalThis);

  const captureFetch: typeof fetch = async (input, init) => {
    const response = await originalFetch(input, init);
    let responseJson: unknown;

    if (response.headers.get("content-type")?.includes("json")) {
      responseJson = await response.clone().json();
    }

    capturedRequests.push({
      body: parseJsonBody(init?.body),
      headers: init?.headers,
      method: init?.method,
      responseJson,
      responseStatus: response.status,
      url: requestUrl(input),
    });

    return response;
  };

  const api = new sdk.SessionsApi(
    new sdk.Configuration({
      accessToken: configuration.accessToken,
      basePath: configuration.baseUrl,
      fetchApi: captureFetch,
    }),
  );

  let result: any;
  try {
    result = await api.recommendProviders({
      health: "All",
      verificationProfileId: configuration.verificationProfileId,
    });
  } catch (error) {
    const captured = capturedRequests.at(-1);
    if (captured) {
      assert.fail(
        `Connect rejected RecommendProviders with HTTP ${captured.responseStatus}. `
        + "The request reached Connect before the SDK could deserialize a response; "
        + "verify that TRINSIC_TEST_ACCESS_TOKEN and TRINSIC_TEST_VERIFICATION_PROFILE_ID "
        + "belong to the selected test environment.",
      );
    }
    throw error;
  }

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

  assert.deepEqual(providerIds(deserializedRecommended), providerIds(rawRecommended));

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
    assert.deepEqual(providerIds(resultRemainder), providerIds(rawRemainder));
  }
  },
));

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

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

function parseJsonBody(body: BodyInit | null | undefined): unknown {
  if (typeof body !== "string") {
    assert.fail("expected SDK request body to be JSON text");
  }

  return JSON.parse(body);
}

function headerValue(headers: HeadersInit | undefined, name: string): string | undefined {
  if (!headers) {
    return undefined;
  }

  if (headers instanceof Headers) {
    return headers.get(name) ?? undefined;
  }

  if (Array.isArray(headers)) {
    return headers.find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1];
  }

  return Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase(),
  )?.[1];
}

function asRecord(value: unknown, label: string): JsonRecord {
  assert.equal(typeof value, "object", `${label} must be an object`);
  assert.notEqual(value, null, `${label} must not be null`);
  assert.equal(Array.isArray(value), false, `${label} must not be an array`);
  return value as JsonRecord;
}

function asRecordArray(value: unknown, label: string): JsonRecord[] {
  assert.ok(Array.isArray(value), `${label} must be an array`);
  return value.map((item, index) => asRecord(item, `${label}[${index}]`));
}

function optionalRecordArray(value: unknown): JsonRecord[] {
  return value === undefined ? [] : asRecordArray(value, "Recommendations response.remainder");
}

function providerIds(providers: JsonRecord[]): string[] {
  return providers.map((provider, index) => {
    assert.equal(
      typeof provider.id,
      "string",
      `provider at index ${index} must have a string id`,
    );
    return provider.id as string;
  });
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
