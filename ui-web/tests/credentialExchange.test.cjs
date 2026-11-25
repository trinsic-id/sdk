const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

const bundle = readFileSync(join(__dirname, "../sdk/dist/index.iife.js"), "utf8");
const digital = {
  requests: [{ protocol: "openid4vp", data: { request: "signed.request", label: "身分証" } }],
};
const v1 = {
  exchangeId: "exchange-1",
  type: "credentialRequest",
  platform: "apple-wallet",
  exchangeMechanism: "DigitalCredentialsApi",
  requestObject: JSON.stringify(digital),
};
const legacy = { ...v1, type: "mdlRequest", exchangeId: "legacy", requestObject: '{"requests":[]}' };

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function loadExchange(get) {
  const { performCredentialExchange } = runInNewContext(bundle + "\nTrinsicUI", {
    atob, btoa, TextDecoder, TextEncoder, navigator: { credentials: { get } },
  });
  return performCredentialExchange;
}

for (const [name, envelope] of [
  ["Apple Wallet v1", { v1 }],
  ["Google Wallet v1 alongside legacy and future versions", {
    ...legacy, v99: null, v1: { ...v1, platform: "google-wallet" },
  }],
]) {
  test(name, async () => {
    const credential = { protocol: "openid4vp", type: "digital", data: { value: "証明🪪" } };
    let calls = 0;
    const exchange = loadExchange(async (options) => {
      calls++;
      // The SDK runs in a different JS realm.
      assert.deepEqual(JSON.parse(JSON.stringify(options)), { digital, mediation: "required" });
      return Object.create(credential);
    });
    const result = await exchange(encode(envelope));
    assert.equal(calls, 1);
    assert.equal(result.exchangeId, v1.exchangeId);
    assert.equal(result.token, encode(credential));
  });
}

for (const [name, envelope, error] of [
  ["unversioned request", legacy, /Unsupported credential challenge version/],
  ["unknown version with legacy fields", { ...legacy, v2: v1 }, /Unsupported credential challenge version/],
  ["non-version keys", { v01: v1, V1: v1, v0: v1 }, /Unsupported credential challenge version/],
  ["non-object envelope", [], /Invalid credential challenge envelope/],
  ["malformed v1 alongside a complete request", { ...v1, v1: null, v2: v1 }, /Invalid v1 credential request/],
  ["v1 missing exchange ID despite root binding", { ...legacy, v1: { ...v1, exchangeId: undefined } }, /exchange ID/],
  ["blank exchange ID", { v1: { ...v1, exchangeId: " " } }, /exchange ID/],
  ["non-string exchange ID", { v1: { ...v1, exchangeId: 1 } }, /exchange ID/],
  ["legacy type inside v1", { v1: legacy }, /credentialRequest/],
  ["unknown wallet", { v1: { ...v1, platform: "other" } }, /platform/],
  ["native mechanism", { v1: { ...v1, exchangeMechanism: "NativeApp" } }, /native mobile app/],
  ["unknown mechanism", { v1: { ...v1, exchangeMechanism: "other" } }, /DigitalCredentialsApi/],
  ["non-string inner request", { v1: { ...v1, requestObject: digital } }, /JSON string/],
  ["malformed inner JSON", { v1: { ...v1, requestObject: "{" } }, /request JSON/],
  ["missing requests", { v1: { ...v1, requestObject: "{}" } }, /requests array/],
  ["non-array requests", { v1: { ...v1, requestObject: '{"requests":{}}' } }, /requests array/],
]) {
  test("rejects " + name + " before invoking the wallet", async () => {
    await assert.rejects(loadExchange(assert.fail)(encode(envelope)), error);
  });
}

test("rejects invalid base64url, UTF-8 and outer JSON before invoking the wallet", async () => {
  const exchange = loadExchange(assert.fail);
  const invalidUtf8 = Buffer.concat([
    Buffer.from('{"ignored":"'), Buffer.from([0xff]), Buffer.from('","v1":' + JSON.stringify(v1) + '}'),
  ]);
  for (const encoded of ["!bad", encode({ v1 }) + " ", invalidUtf8.toString("base64url"), Buffer.from("{").toString("base64url")]) {
    await assert.rejects(exchange(encoded), /Invalid (base64url )?credential challenge/);
  }
});

test("rejects an empty wallet response and propagates wallet errors", async () => {
  const challenge = encode({ v1 });
  await assert.rejects(loadExchange(async () => null)(challenge), /browser does not support/);
  const canceled = new Error("User canceled");
  await assert.rejects(loadExchange(async () => { throw canceled; })(challenge), error => error === canceled);
});

function decodeChallenge(challenge) {
  return JSON.parse(Buffer.from(challenge, "base64url").toString("utf8"));
}

// Both repositories share the version-selection cases. Some upstream expectations
// describe hypothetical v2/v10 consumers. The web SDK selects only v1.
const unsupportedVersion = /Unsupported credential challenge version/;
const invalidRequest = /Invalid v1 credential request/;
const nativeOnly = /native mobile app/;
const nativeFixtureErrors = {
  "legacy": unsupportedVersion,
  "hybrid": nativeOnly,
  "single-version": nativeOnly,
  "unknown-payload-ignored": nativeOnly,
  "unknown-only": unsupportedVersion,
  "hybrid-unknown-only": unsupportedVersion,
  "malformed-selected": invalidRequest,
  "hybrid-malformed-selected": invalidRequest,
  "no-downgrade": nativeOnly,
  "numeric-order": nativeOnly,
  "numeric-order-reversed": nativeOnly,
  "unsupported-huge-version": unsupportedVersion,
  "ignore-non-version-keys": unsupportedVersion,
  "known-plus-huge-unknown": nativeOnly,
  "invalid-inner-json": nativeOnly, // NativeApp is rejected before parsing the inner request.
  "missing-binding": /exchange ID/,
  "invalid-type": /credentialRequest/,
  "null-request": /Invalid credential challenge envelope/,
  "malformed-unselected-supported-version": invalidRequest,
};

const androidChallenges = require("./fixtures/android/native-challenge-versions.json");
const swiftChallenges = require("./fixtures/swift/native-challenge-versions.json");
for (const [sdk, fixtures] of [["Android", androidChallenges], ["Swift", swiftChallenges]]) {
  for (const { name, challenge } of fixtures) {
    test(sdk + " native challenge: " + name, async () => {
      const expectedError = nativeFixtureErrors[name];
      assert.ok(expectedError, "Missing web expectation for " + name);
      await assert.rejects(loadExchange(assert.fail)(challenge), expectedError);
    });
  }
}

const swiftWalletContracts = require("./fixtures/swift/native-wallet-contract.json");
for (const { name, challenge } of swiftWalletContracts) {
  test("Swift wallet contract: " + name + " requires a native app", async () => {
    // Swift's contract tests wrap each stored request in a v1 envelope.
    const request = decodeChallenge(challenge);
    await assert.rejects(loadExchange(assert.fail)(encode({ v1: request })), nativeOnly);
  });
}

// Google's inner OpenID4VP request is also usable with the web mechanism.
// Exercise the version envelopes with only the selected mechanism changed.
const singleVersion = androidChallenges.find(fixture => fixture.name === "single-version");
const googleRequest = decodeChallenge(singleVersion.challenge).v1;
const googleDigital = JSON.parse(googleRequest.requestObject);
for (const { name, challenge } of androidChallenges) {
  if (nativeFixtureErrors[name] !== nativeOnly) continue;
  test("Android OpenID4VP challenge via the browser: " + name, async () => {
    const envelope = decodeChallenge(challenge);
    envelope.v1.exchangeMechanism = "DigitalCredentialsApi";
    const encoded = encode(envelope);
    if (name === "invalid-inner-json") {
      await assert.rejects(loadExchange(assert.fail)(encoded), /request JSON/);
      return;
    }
    await assertWalletExchange(encoded, googleDigital, googleRequest.exchangeId);
  });
}

async function assertWalletExchange(challenge, expectedDigital, expectedExchangeId) {
  let calls = 0;
  const credential = { protocol: "openid4vp", type: "digital", data: { vp_token: "wallet-response" } };
  const exchange = loadExchange(async (options) => {
    calls++;
    assert.deepEqual(JSON.parse(JSON.stringify(options)), { digital: expectedDigital, mediation: "required" });
    return credential;
  });
  const result = await exchange(challenge);
  assert.equal(calls, 1);
  assert.equal(result.exchangeId, expectedExchangeId);
  assert.equal(result.token, encode(credential));
}

// Browser-compatible payloads from Android's CredentialExchangeTest.kt.
for (const [name, requestObject] of [
  ["passport with an extension", '{"requests":[{"protocol":"openid4vp","data":{"dcql_query":{"credentials":[{"id":"passport","format":"mso_mdoc","meta":{"doctype_value":"com.example.passport"}}]},"future":{"unicode":"日本語 🪪"}}}]}'],
  ["signed request and request URI", ' { "requests": [{"protocol":"openid4vp", "data": {"request":"eyJhbGciOiJFUzI1NiJ9.exact_payload.exact-signature", "request_uri":"https://example.test/signed?x=a%2Bb"}}] } '],
]) {
  test("forwards Android " + name + " through the browser", async () => {
    const request = { ...googleRequest, exchangeMechanism: "DigitalCredentialsApi", requestObject };
    await assertWalletExchange(encode({ v1: request }), JSON.parse(requestObject), request.exchangeId);
  });
}
