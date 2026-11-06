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
