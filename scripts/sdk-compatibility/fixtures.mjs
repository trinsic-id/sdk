import { isDeepStrictEqual } from "node:util";
import { readFileSync } from "node:fs";

// Captured from model discovery in the published 3.2.0 packages. These
// contracts must remain covered even if the remote catalog changes later.
const providerModels = JSON.parse(readFileSync(new URL("./provider-models.json", import.meta.url)));

// Expected fields may include legacy aliases still consumed by this release.
// The SDK always receives the complete, unmodified wire response.
export function prepareFixtures(cache, expectedModels = providerModels) {
  for (const providerId of Object.keys(expectedModels)) {
    const matches = cache.fixtures.filter(fixture => fixture.providerId === providerId);
    if (matches.length !== 1 || !matches[0].hasPublicSdkModel || matches[0].output == null) {
      throw new Error(`Required provider fixture ${providerId} is missing, duplicated, nonpublic, or has no payload.`);
    }
  }
  return { ...cache, fixtures: [
    ...cache.fixtures.map(fixture => ({
      ...fixture, serializationOutput: fixture.legacySerializationOutput ?? fixture.output,
      modelRequired: Object.hasOwn(expectedModels, fixture.providerId),
      ...(expectedModels[fixture.providerId] ? { sdkModelName: expectedModels[fixture.providerId] } : {}),
      // In 3.2.0 ItsmeProviderOutput describes the login integration. The direct
      // provider appeared later and reused the model name for a different shape.
      ...(fixture.providerId === "itsme" ? { unavailableModel: "SDK 3.2.0 predates the direct itsme provider; ItsmeProviderOutput belongs to a-itsme-login." } : {}),
    })),
    ...forwardCompatibilityFixtures(),
  ] };
}

export function validateCoverage(fixtures, testCases) {
  return fixtures.flatMap(fixture => {
    const id = fixture.testCaseId ?? "serialization.provider-output-round-trip";
    const matches = testCases.filter(test => test.id === id && test.parameters?.providerId === fixture.providerId);
    return matches.length !== 1 || (fixture.modelRequired && matches[0].status === "skipped")
      ? [`Missing or skipped required coverage for ${fixture.providerId} (${fixture.sdkModelName ?? "no public model"}).`]
      : [];
  });
}

export function validateWireAliases(cache, aliases = [{ providerId: "singpass-myinfo", legacyPath: "personInfo.houseDevelopmenetBoardType", currentPath: "personInfo.houseDevelopmentBoardType" }]) {
  const atPath = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
  return aliases.map(({ providerId, legacyPath, currentPath }) => {
    const result = { id: "serialization.legacy-wire-aliases", durationMs: 0, parameters: { providerId, legacyPath, currentPath } };
    const fixture = cache.fixtures.find((value) => value.providerId === providerId);
    if (!fixture) return { ...result, status: "failed", failure: { name: "LegacyWireAliasError", message: "Provider is not exposed by this environment's fixture catalog." } };
    const oldValue = atPath(fixture.output, legacyPath), currentValue = atPath(fixture.output, currentPath);
    return oldValue !== undefined && currentValue !== undefined && isDeepStrictEqual(oldValue, currentValue)
      ? { ...result, status: "passed" }
      : { ...result, status: "failed", failure: { name: "LegacyWireAliasError", message: `${providerId}: ${legacyPath} must remain on the wire and equal ${currentPath}.` } };
  });
}

export function forwardCompatibilityFixtures() {
  const step = { method: "LaunchBrowser", content: "https://example.com/sdk-test" };
  const namespaces = { "org.iso.18013.5.1": { given_name: { type: "String", value: "Ada" }, age_over_18: { type: "Boolean", value: "true" } } };
  const certificate = { serialNumber: "123", commonName: "Test IACA", stateOrProvinceName: "US-CA", notBefore: "2023-03-01T17:17:39.000Z", notAfter: "2033-01-07T17:17:39.000Z" };
  const mdl = { iacaRootCertificate: certificate, documentSignerCertificate: certificate, documentType: "org.iso.18013.5.1.mDL", nameSpaces: namespaces };
  return [
    { testCaseId: "serialization.unknown-fields", sdkModelName: "IntegrationStep", output: { ...step, futureField: { nested: [1, "new"] } }, serializationOutput: step },
    { testCaseId: "serialization.nested-model-dictionaries", sdkModelName: "MdlOutput", output: mdl, serializationOutput: mdl },
  ].map((fixture) => ({ ...fixture, hasPublicSdkModel: true, modelRequired: true, providerId: fixture.testCaseId }));
}
