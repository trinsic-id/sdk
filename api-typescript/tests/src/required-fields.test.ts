import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "./results.js";
import * as sdk from "@trinsic/api";
import { assertRequiredFields, modelFields } from "./required-fields.js";

const version = JSON.parse(readFileSync(createRequire(import.meta.url).resolve("@trinsic/api/package.json"), "utf8")).version;
const legacyMdl = version === "3.2.0";
const step = { method: "LaunchBrowser", content: "https://example.test/start" };
const certificate = { serialNumber: "123", commonName: "Test IACA", stateOrProvinceName: "US-CA", notBefore: "2023-03-01T17:17:39.000Z", notAfter: "2033-01-07T17:17:39.000Z" };
const mdl = { iacaRootCertificate: certificate, documentSignerCertificate: certificate, documentType: "org.iso.18013.5.1.mDL", nameSpaces: { namespace: { entry: { type: "String", value: "Ada" } } } };

test("Installed release determines required fields inside aliased provider output", () => {
  const { documentType, ...missing } = mdl;
  const validate = () => assertRequiredFields("ProviderOutput", { "france-identite": { raw18013Output: missing } });
  if (legacyMdl) assert.throws(validate, /france-identite\.raw18013Output\.documentType: required field is missing/);
  else assert.doesNotThrow(validate);
});

test("Required fields are checked before date conversion and inside arrays", () => {
  assert.throws(() => assertRequiredFields("IntegrationStep", { ...step, refresh: { refreshAfter: "2026-01-01T00:00:00Z", timeToLiveSeconds: 60 } }), /refresh\.expiresAt: required field is missing/);
  assert.throws(() => assertRequiredFields("RecommendProvidersResponse", { recommendedProviders: [{}], remainder: [] }), /recommendedProviders\[0\]\.id: required field is missing/);
});

test("Nested dictionary values use the installed release's required fields", () => {
  const validate = () => assertRequiredFields("MdlOutput", { ...mdl, nameSpaces: { namespace: { entry: { type: "String" } } } });
  if (legacyMdl) assert.throws(validate, /nameSpaces\["namespace"\]\["entry"\]\.value: required field is missing/);
  else assert.doesNotThrow(validate);
});

test("Optional nulls, unknown properties and future enum values remain allowed", () => {
  for (const value of [step, { ...step, refresh: null }, { ...step, futureField: { nested: true } }, { ...step, method: "FutureMethod" }]) {
    assert.doesNotThrow(() => assertRequiredFields("IntegrationStep", value));
  }
  assert.throws(() => assertRequiredFields("IntegrationStep", { ...step, content: null }), /content: required field must not be null/);
});

test("Required-field failure retains its provider result and later fixtures", () => {
  const directory = mkdtempSync(join(tmpdir(), "trinsic-required-fields-"));
  try {
    const fixtures = join(directory, "fixtures.json"), output = join(directory, "results.json");
    const { documentType, ...missing } = mdl;
    writeFileSync(fixtures, JSON.stringify({ fixtures: [
      { providerId: "france-identite", hasPublicSdkModel: true, sdkModelName: "FranceIdentiteProviderOutput", output: { raw18013Output: missing } },
      { providerId: "later", hasPublicSdkModel: true, sdkModelName: "IntegrationStep", output: step },
    ] }));
    const env: NodeJS.ProcessEnv = { ...process.env, SDK_TARGET_LABEL: "typescript regression", SDK_VERSION: version, SDK_COMPATIBILITY_PSO_FIXTURES_PATH: fixtures, SDK_COMPATIBILITY_RESULT_FILE: output, TRINSIC_TEST_BASE_URL: "https://example.test", TRINSIC_TEST_ACCESS_TOKEN: "test-only", TRINSIC_TEST_VERIFICATION_PROFILE_ID: "00000000-0000-4000-8000-000000000001" };
    delete env.NODE_TEST_CONTEXT;
    const result = spawnSync(process.execPath, ["--import", "tsx", "--test", fileURLToPath(new URL("./provider-outputs.test.ts", import.meta.url))], { cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8", env });
    assert.equal(result.status, legacyMdl ? 1 : 0, result.stdout + result.stderr);
    const cases = JSON.parse(readFileSync(output, "utf8")).testCases;
    const provider = cases.find((entry: any) => entry.parameters?.providerId === "france-identite");
    assert.equal(provider.status, legacyMdl ? "failed" : "passed");
    if (legacyMdl) assert.match(provider.failure.message, /raw18013Output\.documentType: required field is missing/);
    assert.equal(cases.find((entry: any) => entry.parameters?.providerId === "later").status, "passed");
  } finally { rmSync(directory, { recursive: true, force: true }); }
});


test("Supported fields survive decoding while future fields are ignored", () => {
  const wire = { ...step, future: true };
  assert.deepEqual(modelFields("IntegrationStep", wire), step);
  assert.deepEqual(modelFields("IntegrationStep", wire, step), step);
  assert.throws(() => modelFields("IntegrationStep", wire, { method: step.method }), /scalar type must be string/);
  assert.throws(() => modelFields("MdlOutput", mdl, { ...mdl, nameSpaces: {} }), /dictionary keys/);
  assert.throws(() => modelFields("RecommendProvidersResponse", { recommendedProviders: [{ id: "provider" }], remainder: [] }, { recommendedProviders: [], remainder: [] }), /array length/);
});


test("Decoded date-only fields retain their calendar date", () => {
  const wire = { dateOfBirth: "2000-01-02" };
  const decoded = sdk.PolandEdoAppProviderOutputFromJSON(wire);
  assert.deepEqual(modelFields("PolandEdoAppProviderOutput", wire, decoded), wire);
  decoded.dateOfBirth = new Date("2000-01-02T12:00:00Z");
  assert.throws(() => modelFields("PolandEdoAppProviderOutput", wire, decoded), /time component/);
});

test("Permissive converters cannot return numbers as declared boolean or string fields", () => {
  assert.throws(() => modelFields("Session", { done: 1 }, { done: 1 }), /scalar type must be boolean/);
  assert.throws(() => modelFields("IntegrationStep", { content: 1 }, { content: 1 }), /scalar type must be string/);
  assert.deepEqual(modelFields("IntegrationStep", { method: "FutureMethod" }, { method: "FutureMethod" }), { method: "FutureMethod" });
});

const session = { id: "00000000-0000-4000-8000-000000000001", done: false, success: false, created: 1, updated: 1 };
const provider = {
  id: "provider", name: "Provider", logoUrl: "https://example.test/logo", subtext: "Description", health: "Healthy",
  regions: [], countries: ["US"], subdivisions: [],
  subProviders: [{ id: "sub", name: "Sub", subtext: "Description", logoUrl: "https://example.test/sub" }],
};

function compareResponse(modelName: string, wire: unknown, decoded: unknown) {
  assert.deepEqual(modelFields(modelName, wire, decoded), modelFields(modelName, wire));
}

for (const sessions of [[], [session]]) {
  test(`Published session model preserves a page with ${sessions.length} entries`, () => {
    const wire = { sessions, total: sessions.length, more: false, futureField: "ignored" };
    compareResponse("ListSessionsResponse", wire, sdk.ListSessionsResponseFromJSON(wire));
  });
}

for (const mutation of ["truncate", "id", "total", "more"] as const) {
  test(`Published session model rejects changed ${mutation}`, () => {
    const wire = { sessions: [session], total: 1, more: false };
    const decoded = sdk.ListSessionsResponseFromJSON(wire);
    compareResponse("ListSessionsResponse", wire, decoded);
    switch (mutation) {
      case "truncate": decoded.sessions.length = 0; break;
      case "id": decoded.sessions[0].id = "00000000-0000-4000-8000-000000000002"; break;
      case "total": decoded.total = 2; break;
      case "more": decoded.more = true; break;
    }
    assert.throws(() => compareResponse("ListSessionsResponse", wire, decoded), assert.AssertionError);
  });
}

for (const field of ["recommendedProviders", "remainder"] as const) {
  for (const mutation of ["unchanged", "provider", "country", "subprovider"] as const) {
    test(`Published recommendation model checks ${field}: ${mutation}`, () => {
      const wire = { recommendedProviders: [provider], remainder: [provider], futureField: "ignored" };
      // Converters can retain scalar arrays; keep the reference wire payload independent.
      const decoded = sdk.RecommendProvidersResponseFromJSON(structuredClone(wire));
      compareResponse("RecommendProvidersResponse", wire, decoded);
      switch (mutation) {
        case "unchanged": return;
        case "provider": decoded[field].length = 0; break;
        case "country": decoded[field][0].countries.length = 0; break;
        case "subprovider": decoded[field][0].subProviders![0].name = "Changed"; break;
      }
      assert.throws(() => compareResponse("RecommendProvidersResponse", wire, decoded), assert.AssertionError);
    });
  }
}
