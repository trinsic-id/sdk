import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readTestConfiguration } from "./config.js";

export type JsonRecord = Record<string, unknown>;
export const configuration = readTestConfiguration();
export const targetLabel = requiredEnvironment("SDK_TARGET_LABEL");
export const sdkVersion = requiredEnvironment("SDK_VERSION");
export const isCurrentSdk = requiredEnvironment("SDK_IS_CURRENT") === "true";
export const sdk: Record<string, any> = createRequire(`${requiredEnvironment("SDK_INSTALL_ROOT")}/package.json`)("@trinsic/api");

export function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} must be supplied by the compatibility test runner.`);
  return value;
}

export function sdkConfiguration(fetchApi?: typeof fetch): any {
  return new sdk.Configuration({ accessToken: configuration.accessToken, basePath: configuration.baseUrl, fetchApi });
}

interface CapturedRequest {
  body: unknown;
  headers: HeadersInit | undefined;
  method: string | undefined;
  responseJson: unknown;
  responseStatus: number;
  url: string;
}

export function captureRequests() {
  const requests: CapturedRequest[] = [];
  const capture: typeof fetch = async (input, init) => {
    const response = await globalThis.fetch(input, init);
    requests.push({
      body: typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
      headers: init?.headers,
      method: init?.method,
      responseJson: response.headers.get("content-type")?.includes("json") ? await response.clone().json() : undefined,
      responseStatus: response.status,
      url: typeof input === "string" ? input : input instanceof URL ? input.href : input.url,
    });
    return response;
  };
  return { requests, config: sdkConfiguration(capture) };
}

export function headerValue(headers: HeadersInit | undefined, name: string): string | undefined {
  return new Headers(headers).get(name) ?? undefined;
}

export function asRecord(value: unknown, label: string): JsonRecord {
  assert.equal(typeof value, "object", `${label} must be an object`);
  assert.notEqual(value, null, `${label} must not be null`);
  assert.equal(Array.isArray(value), false, `${label} must not be an array`);
  return value as JsonRecord;
}

export function asRecordArray(value: unknown, label: string): JsonRecord[] {
  assert.ok(Array.isArray(value), `${label} must be an array`);
  return value.map((item, index) => asRecord(item, `${label}[${index}]`));
}

export function recordIds(records: JsonRecord[]): string[] {
  return records.map((record, index) => {
    assert.equal(typeof record.id, "string", `response entry ${index} must have a string id`);
    return record.id as string;
  });
}
