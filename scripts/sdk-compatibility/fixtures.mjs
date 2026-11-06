import { isDeepStrictEqual } from "node:util";

// Expected fields may include legacy aliases still consumed by this release.
// The SDK always receives the complete, unmodified wire response.
export function prepareFixtures(cache) {
  return { ...cache, fixtures: [
    ...cache.fixtures.map(fixture => ({
      ...fixture, serializationOutput: fixture.legacySerializationOutput ?? fixture.output,
      // In 3.2.0 ItsmeProviderOutput describes the login integration. The direct
      // provider appeared later and reused the model name for a different shape.
      ...(fixture.providerId === "a-itsme-login" ? { sdkModelName: "ItsmeProviderOutput" } : {}),
      ...(fixture.providerId === "itsme" ? { unavailableModel: "SDK 3.2.0 predates the direct itsme provider; ItsmeProviderOutput belongs to a-itsme-login." } : {}),
    })),
    ...forwardCompatibilityFixtures(),
  ] };
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
    // Success means a future enum does not prevent parsing the rest of a known
    // response. SDKs may preserve the value or expose their unknown sentinel.
    { testCaseId: "serialization.unknown-enum", sdkModelName: "IntegrationStep", output: { ...step, method: "FutureSdkTestMethod" }, serializationOutput: { content: step.content } },
    { testCaseId: "serialization.nested-model-dictionaries", sdkModelName: "MdlOutput", output: mdl, serializationOutput: mdl },
  ].map((fixture) => ({ ...fixture, hasPublicSdkModel: true, providerId: fixture.testCaseId }));
}
