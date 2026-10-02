/**
 * Assertions for new fields or models are explicitly version-gated so that
 * releases still listed in compatibility.json are evaluated against the
 * contract they actually expose.
 */
export const MINIMUM_SDK_VERSION = {
  recommendProvidersRemainder: "3.1.0",
} as const;

export const RECOMMEND_PROVIDER_REQUIRED_STRING_FIELDS = [
  "id",
  "name",
  "logoUrl",
  "subtext",
  "health",
] as const;

export const RECOMMEND_PROVIDER_REQUIRED_STRING_ARRAY_FIELDS = [
  "regions",
  "countries",
  "subdivisions",
] as const;

export const SUB_PROVIDER_REQUIRED_STRING_FIELDS = [
  "id",
  "name",
  "subtext",
  "logoUrl",
] as const;
