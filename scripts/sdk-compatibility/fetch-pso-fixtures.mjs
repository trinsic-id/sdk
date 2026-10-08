#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

const baseUrl = required("TRINSIC_TEST_BASE_URL").replace(/\/$/, "");
const token = required("TRINSIC_TEST_ACCESS_TOKEN");
const output = required("SDK_COMPATIBILITY_PSO_FIXTURES_PATH");
const headers = { Accept: "application/json", Authorization: `Bearer ${token}` };

const catalogResponse = await fetch(`${baseUrl}/api/v1/providers/sample-json/outputs`, { headers });
if (!catalogResponse.ok) throw new Error(`Provider-output fixture catalog returned HTTP ${catalogResponse.status}.`);
const catalog = await catalogResponse.json();
if (!Array.isArray(catalog)) throw new Error("Provider-output fixture catalog was not an array.");

const fixtures = await Promise.all(catalog.map(async (fixture) => {
  if (!fixture?.hasPublicSdkModel) return fixture;
  const response = await fetch(`${baseUrl}/api/v1/providers/${encodeURIComponent(fixture.providerId)}/sample-json/output`, { headers });
  if (!response.ok) throw new Error(`Provider-output fixture for ${fixture.providerId} returned HTTP ${response.status}.`);
  return { ...fixture, output: await response.json() };
}));

await writeFile(output, `${JSON.stringify({ schemaVersion: 1, targetBaseUrl: baseUrl, fixtures })}\n`);
console.log(`Cached ${fixtures.length} provider-output fixtures.`);

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}
