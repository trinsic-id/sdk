import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import { readTestConfiguration } from "./config.js";
import { recordCompatibilityCase } from "./results.js";

type JsonRecord = Record<string, unknown>;
type SdkModule = Record<string, any>;

interface CapturedRequest {
  headers: HeadersInit | undefined;
  method: string | undefined;
  responseJson: unknown;
  url: string;
}

const installRoot = requiredEnvironment("SDK_INSTALL_ROOT");
const targetLabel = requiredEnvironment("SDK_TARGET_LABEL");
const configuration = readTestConfiguration();
const sdk = loadSdk(installRoot);

test(`${targetLabel}: ListProviders uses the supported provider-list contract`, () =>
  recordReadApiCase(
    "api.providers.list",
    "/api/v1/providers",
    () => new sdk.ProvidersApi(configurationWithCapture()).listProviders(),
    (result, response) => {
      assertRecordArray(result.providers, "SDK provider response.providers");
      assert.deepEqual(
        recordIds(result.providers),
        recordIds(asRecordArray(response.providers, "Provider response.providers")),
      );
    },
  ));

test(`${targetLabel}: GetVerificationProfileById uses the configured profile`, () =>
  recordReadApiCase(
    "api.verification-profiles.get-by-id",
    `/api/valpha/verification-profiles/${configuration.verificationProfileId}`,
    () => new sdk.VerificationProfilesApi(configurationWithCapture()).getVerificationProfileById(configuration.verificationProfileId),
    (result, response) => {
      assert.equal(normalizeUuid(result.id), normalizeUuid(configuration.verificationProfileId));
      assert.equal(normalizeUuid(result.id), normalizeUuid(response.id));
      assert.equal(result.alias, response.alias);
      assert.equal(result.brandName, response.brandName);
    },
  ));

test(`${targetLabel}: ListVerificationProfiles includes the configured profile`, () =>
  recordReadApiCase(
    "api.verification-profiles.list",
    "/api/valpha/verification-profiles",
    () => new sdk.VerificationProfilesApi(configurationWithCapture()).listVerificationProfiles(undefined, 50),
    (result, response) => {
      assertRecordArray(result.verificationProfiles, "SDK verification-profile response.verificationProfiles");
      assert.deepEqual(
        recordIds(result.verificationProfiles),
        recordIds(asRecordArray(response.verificationProfiles, "Verification-profile response.verificationProfiles")),
      );
    },
  ));

test(`${targetLabel}: ListSessions returns the configured profile's session page`, () =>
  recordReadApiCase(
    "api.sessions.list",
    `/api/v1/verification-profiles/${configuration.verificationProfileId}/sessions`,
    () => new sdk.SessionsApi(configurationWithCapture()).listSessions(configuration.verificationProfileId, undefined, undefined, 1),
    (result, response) => {
      assertRecordArray(result.sessions, "SDK session response.sessions");
      assert.equal(result.more, response.more);
      assert.equal(result.total, response.total);
      assert.deepEqual(
        recordIds(result.sessions),
        recordIds(asRecordArray(response.sessions, "Session response.sessions")),
      );
    },
  ));

test(`${targetLabel}: ListRedirectUris returns the environment's redirect-URI page`, () =>
  recordReadApiCase(
    "api.redirect-uris.list",
    "/api/valpha/redirect-uris",
    () => new sdk.RedirectUrisApi(configurationWithCapture()).list(undefined, 1),
    (result, response) => {
      assertRecordArray(result.uris, "SDK redirect-URI response.uris");
      assert.equal(result.more, response.more);
      assert.deepEqual(
        recordIds(result.uris),
        recordIds(asRecordArray(response.uris, "Redirect-URI response.uris")),
      );
    },
  ));

function configurationWithCapture(): any {
  return new sdk.Configuration({
    accessToken: configuration.accessToken,
    basePath: configuration.baseUrl,
    fetchApi: captureFetch,
  });
}

const capturedRequests: CapturedRequest[] = [];
const originalFetch = globalThis.fetch.bind(globalThis);
const captureFetch: typeof fetch = async (input, init) => {
  const response = await originalFetch(input, init);
  let responseJson: unknown;
  if (response.headers.get("content-type")?.includes("json")) {
    responseJson = await response.clone().json();
  }
  capturedRequests.push({
    headers: init?.headers,
    method: init?.method,
    responseJson,
    url: requestUrl(input),
  });
  return response;
};

function recordReadApiCase(
  id: string,
  expectedPath: string,
  request: () => Promise<any>,
  assertResponse: (result: any, response: JsonRecord) => void,
): Promise<void> {
  return recordCompatibilityCase(id, async () => {
    const requestCount = capturedRequests.length;
    const result = await request();
    const captured = capturedRequests.at(-1);
    assert.equal(capturedRequests.length, requestCount + 1, "expected one API request");
    assert.ok(captured, "expected the SDK request to be captured");
    assert.equal(captured.method, "GET");
    assert.equal(new URL(captured.url).pathname, expectedPath);
    assert.equal(
      headerValue(captured.headers, "authorization"),
      `Bearer ${configuration.accessToken}`,
      "expected the SDK to attach the configured developer authentication",
    );
    assertResponse(result, asRecord(captured.responseJson, "API response"));
  });
}

function loadSdk(root: string): SdkModule {
  const requireFromInstalledPackage = createRequire(`${root}/package.json`);
  return requireFromInstalledPackage("@trinsic/api") as SdkModule;
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} must be supplied by the compatibility test runner.`);
  return value;
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  return input instanceof URL ? input.toString() : input.url;
}

function headerValue(headers: HeadersInit | undefined, name: string): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) ?? undefined;
  if (Array.isArray(headers)) return headers.find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1];
  return Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1];
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

function assertRecordArray(value: unknown, label: string): asserts value is JsonRecord[] {
  asRecordArray(value, label);
}

function recordIds(records: JsonRecord[]): string[] {
  return records.map((record, index) => {
    assert.equal(typeof record.id, "string", `response entry ${index} must have a string id`);
    return record.id as string;
  });
}

function normalizeUuid(value: unknown): string {
  assert.equal(typeof value, "string", "verification profile ID must be a string");
  return (value as string).toLowerCase();
}
