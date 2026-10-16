#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

const baseUrl = required("TRINSIC_TEST_BASE_URL").replace(/\/$/, "");
const token = required("TRINSIC_TEST_ACCESS_TOKEN");
const output = required("SDK_COMPATIBILITY_PSO_FIXTURES_PATH");
const headers = { Accept: "application/json", Authorization: `Bearer ${token}` };

const swaggerResponse = await fetch(`${baseUrl}/swagger/api/swagger.json`, { headers });
if (!swaggerResponse.ok) throw new Error(`Swagger document returned HTTP ${swaggerResponse.status}.`);
const swagger = await swaggerResponse.json();
if (!swagger?.components?.schemas || typeof swagger.components.schemas !== "object") {
  throw new Error("Swagger document did not contain components.schemas.");
}

const catalogResponse = await fetch(`${baseUrl}/api/v1/providers/sample-json/outputs`, { headers });
if (!catalogResponse.ok) throw new Error(`Provider-output fixture catalog returned HTTP ${catalogResponse.status}.`);
const catalog = await catalogResponse.json();
if (!Array.isArray(catalog)) throw new Error("Provider-output fixture catalog was not an array.");

const fixtures = await Promise.all(catalog.map(async (fixture) => {
  if (!fixture?.hasPublicSdkModel) return fixture;
  const response = await fetch(`${baseUrl}/api/v1/providers/${encodeURIComponent(fixture.providerId)}/sample-json/output`, { headers });
  if (!response.ok) throw new Error(`Provider-output fixture for ${fixture.providerId} returned HTTP ${response.status}.`);
  const schema = swagger.components.schemas[fixture.sdkModelName];
  const providerOutput = await response.json();
  if (!schema) {
    console.warn(`Swagger did not contain ${fixture.sdkModelName} for ${fixture.providerId}; keeping the unfiltered fixture so the missing-model check can report it.`);
    return { ...fixture, output: providerOutput, serializationOutput: providerOutput };
  }
  return {
    ...fixture,
    output: filterToSchema(providerOutput, schema, swagger.components.schemas),
    serializationOutput: filterToSchema(providerOutput, schema, swagger.components.schemas, { excludeReadOnly: true }),
  };
}));

await writeFile(output, `${JSON.stringify({ schemaVersion: 1, targetBaseUrl: baseUrl, fixtures })}\n`);
console.log(`Cached ${fixtures.length} provider-output fixtures.`);

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function filterToSchema(value, schema, schemas, { excludeReadOnly = false } = {}) {
  const resolved = resolveSchema(schema, schemas);
  if (isUnconstrained(resolved)) return value;

  if (Array.isArray(value)) {
    const itemSchema = childSchema(resolved, "items", schemas);
    return itemSchema === undefined ? value : value.map((item) => filterToSchema(item, itemSchema, schemas, { excludeReadOnly }));
  }

  if (!isObject(value)) return value;

  return Object.fromEntries(Object.entries(value).flatMap(([key, child]) => {
    const propertySchema = propertySchemaFor(resolved, key, schemas);
    return propertySchema === undefined || (excludeReadOnly && isReadOnly(propertySchema, schemas))
      ? []
      : [[key, filterToSchema(child, propertySchema, schemas, { excludeReadOnly })]];
  }));
}

function propertySchemaFor(schema, propertyName, schemas) {
  const candidates = [];
  collectPropertySchemas(schema, propertyName, schemas, candidates);
  return combineSchemas(candidates);
}

function collectPropertySchemas(schema, propertyName, schemas, candidates, visited = new Set()) {
  const resolved = resolveSchema(schema, schemas, visited);
  if (!resolved || typeof resolved !== "object") return;

  if (resolved.properties && Object.hasOwn(resolved.properties, propertyName)) {
    candidates.push(resolved.properties[propertyName]);
  }
  for (const keyword of ["allOf", "anyOf", "oneOf"]) {
    for (const member of resolved[keyword] ?? []) {
      collectPropertySchemas(member, propertyName, schemas, candidates, new Set(visited));
    }
  }
  if (candidates.length === 0 && resolved.additionalProperties !== undefined) {
    candidates.push(resolved.additionalProperties === true ? {} : resolved.additionalProperties);
  }
}

function childSchema(schema, propertyName, schemas) {
  const candidates = [];
  collectChildSchemas(schema, propertyName, schemas, candidates);
  return combineSchemas(candidates);
}

function collectChildSchemas(schema, propertyName, schemas, candidates, visited = new Set()) {
  const resolved = resolveSchema(schema, schemas, visited);
  if (!resolved || typeof resolved !== "object") return;
  if (resolved[propertyName] !== undefined) candidates.push(resolved[propertyName]);
  for (const keyword of ["allOf", "anyOf", "oneOf"]) {
    for (const member of resolved[keyword] ?? []) {
      collectChildSchemas(member, propertyName, schemas, candidates, new Set(visited));
    }
  }
}

function combineSchemas(candidates) {
  if (candidates.length === 0) return undefined;
  return candidates.length === 1 ? candidates[0] : { allOf: candidates };
}

function resolveSchema(schema, schemas, visited = new Set()) {
  if (!schema || typeof schema !== "object" || !schema.$ref) return schema;
  const prefix = "#/components/schemas/";
  if (!schema.$ref.startsWith(prefix)) throw new Error(`Unsupported Swagger reference: ${schema.$ref}.`);
  const name = schema.$ref.slice(prefix.length);
  if (visited.has(name)) return {};
  const referenced = schemas[name];
  if (!referenced) throw new Error(`Swagger reference did not resolve: ${schema.$ref}.`);
  return resolveSchema(referenced, schemas, new Set([...visited, name]));
}

function isUnconstrained(schema) {
  return isObject(schema) && Object.keys(schema).length === 0;
}

function isReadOnly(schema, schemas, visited = new Set()) {
  const resolved = resolveSchema(schema, schemas, visited);
  if (!resolved || typeof resolved !== "object") return false;
  if (resolved.readOnly === true) return true;
  return ["allOf", "anyOf", "oneOf"].some((keyword) =>
    (resolved[keyword] ?? []).some((member) => isReadOnly(member, schemas, new Set(visited))),
  );
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
