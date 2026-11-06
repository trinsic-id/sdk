import { isDeepStrictEqual } from "node:util";

/** Resolve historical provider contracts without changing the wire payload. */
export function targetFixtures(cache, target, compatibility) {
  const mappings = compatibility.providerMappings?.[target.version] ?? {};
  return {
    ...cache,
    fixtures: [...cache.fixtures.map((fixture) => {
      if (target.isCurrent) return fixture;
      const mapping = mappings[fixture.providerId];
      return {
        ...fixture,
        // Today's Swagger omits legacy aliases that older models still consume.
        serializationOutput: fixture.legacySerializationOutput ?? fixture.output,
        ...(mapping?.sdkModelName ? { sdkModelName: mapping.sdkModelName } : {}),
        ...(mapping?.unsupportedReason ? { unsupportedReason: mapping.unsupportedReason } : {}),
      };
    }), ...forwardCompatibilityFixtures()],
  };
}

export function validateWireAliases(cache, aliases = []) {
  const atPath = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
  return aliases.map(({ providerId, legacyPath, currentPath }) => {
    const result = { id: "serialization.legacy-wire-aliases", durationMs: 0, parameters: { providerId, legacyPath, currentPath } };
    const fixture = cache.fixtures.find((value) => value.providerId === providerId);
    if (!fixture) return { ...result, status: "skipped", skipReason: "Provider is not exposed by this environment's fixture catalog." };
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
