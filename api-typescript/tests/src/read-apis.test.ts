import assert from "node:assert/strict";
import test from "node:test";
import { asRecord, asRecordArray, captureRequests, configuration, headerValue, recordIds, sdk, targetLabel, type JsonRecord } from "./support.js";

import { recordCompatibilityCase } from "./results.js";

const { requests: capturedRequests, config: clientConfig } = captureRequests();

test(`${targetLabel}: ListProviders uses the supported provider-list contract`, () =>
  recordReadApiCase(
    "api.providers.list",
    "/api/v1/providers",
    () => new sdk.ProvidersApi(clientConfig).listProviders(),
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
    () => new sdk.VerificationProfilesApi(clientConfig).getVerificationProfileById(configuration.verificationProfileId),
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
    () => new sdk.VerificationProfilesApi(clientConfig).listVerificationProfiles(undefined, 50),
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
    () => new sdk.SessionsApi(clientConfig).listSessions(configuration.verificationProfileId, undefined, undefined, 1),
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
    () => new sdk.RedirectUrisApi(clientConfig).list(undefined, 1),
    (result, response) => {
      assertRecordArray(result.uris, "SDK redirect-URI response.uris");
      assert.equal(result.more, response.more);
      assert.deepEqual(
        recordIds(result.uris),
        recordIds(asRecordArray(response.uris, "Redirect-URI response.uris")),
      );
    },
  ));

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

function assertRecordArray(value: unknown, label: string): asserts value is JsonRecord[] {
  asRecordArray(value, label);
}

function normalizeUuid(value: unknown): string {
  assert.equal(typeof value, "string", "verification profile ID must be a string");
  return (value as string).toLowerCase();
}
