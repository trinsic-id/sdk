import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import ts from "typescript";

const require = createRequire(import.meta.url);
let installedContract: ReturnType<typeof loadContract> | undefined;

function loadContract() {
  const packagePath = require.resolve("@trinsic/api/package.json");
  const metadata = JSON.parse(readFileSync(packagePath, "utf8"));
  assert.equal(typeof metadata.types, "string", "installed SDK must expose TypeScript declarations");
  const entry = resolve(dirname(packagePath), metadata.types);
  const program = ts.createProgram([entry], {
    strictNullChecks: true,
    skipLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.Node10,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entry);
  assert.ok(source, "installed SDK declarations must be readable");
  const module = checker.getSymbolAtLocation(source);
  assert.ok(module, "installed SDK declarations must export models");
  const models = new Map(checker.getExportsOfModule(module).map(symbol => [symbol.name, symbol]));
  const wireProperties = new Map<string, Map<string, string>>();
  function wireName(property: ts.Symbol): string {
    const declaration = property.valueDeclaration ?? property.declarations?.[0];
    assert.ok(declaration, `${property.name} must have an SDK declaration`);
    const file = declaration.getSourceFile().fileName.replace(/\.d\.ts$/, ".js");
    let names = wireProperties.get(file);
    if (!names) {
      names = new Map();
      const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      const collect = (node: ts.Node): void => {
        if (ts.isFunctionDeclaration(node) && node.name?.text.endsWith("FromJSONTyped")) {
          const fields = (child: ts.Node): void => {
            if (ts.isPropertyAssignment(child) && (ts.isStringLiteral(child.name) || ts.isIdentifier(child.name))) {
              let wire: string | undefined;
              const access = (expression: ts.Node): void => {
                if (ts.isElementAccessExpression(expression) && ts.isIdentifier(expression.expression)
                  && expression.expression.text === "json" && ts.isStringLiteral(expression.argumentExpression)) {
                  wire ??= expression.argumentExpression.text;
                }
                ts.forEachChild(expression, access);
              };
              access(child.initializer);
              if (wire) names!.set(child.name.text, wire);
            }
            ts.forEachChild(child, fields);
          };
          if (node.body) fields(node.body);
        }
        ts.forEachChild(node, collect);
      };
      collect(source);
      wireProperties.set(file, names);
    }
    const name = names.get(property.name);
    assert.ok(name, `installed SDK converter must identify the wire name for ${property.name}`);
    return name;
  }
  return { checker, models, wireName };
}

export function assertRequiredFields(modelName: string, wire: unknown, path = modelName): void {
  const { checker, models, wireName } = installedContract ??= loadContract();
  let model = models.get(modelName);
  assert.ok(model, `installed SDK declarations must export ${modelName}`);
  if (model.flags & ts.SymbolFlags.Alias) model = checker.getAliasedSymbol(model);
  const type = checker.getDeclaredTypeOfSymbol(model);
  assert.ok(type.flags & ts.TypeFlags.Object, `${modelName} must declare an SDK model`);
  assert.ok(wire !== null && typeof wire === "object" && !Array.isArray(wire), `${path} must be an object`);
  visit(type, wire, path);

  function visit(declared: ts.Type, value: unknown, label: string): void {
    if (value === undefined || value === null) return;
    const concrete = checker.getNonNullableType(declared);
    if (concrete.isUnion()) {
      const failures: unknown[] = [];
      for (const member of concrete.types) {
        try { visit(member, value, label); return; }
        catch (error) { failures.push(error); }
      }
      throw new AggregateError(failures, `${label}: no SDK model alternative preserves its required fields`);
    }
    if (!(concrete.flags & ts.TypeFlags.Object) || concrete.getSymbol()?.name === "Date") return;
    if (checker.isArrayType(concrete)) {
      assert.ok(Array.isArray(value), `${label} must be an array`);
      const [item] = checker.getTypeArguments(concrete as ts.TypeReference);
      for (const [index, child] of value.entries()) visit(item, child, `${label}[${index}]`);
      return;
    }
    assert.ok(typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
    const record = value as Record<string, unknown>;
    for (const property of checker.getPropertiesOfType(concrete)) {
      const declaration = property.valueDeclaration ?? property.declarations?.[0];
      assert.ok(declaration, `${label}.${property.name} must have a declaration`);
      const propertyType = checker.getTypeOfSymbolAtLocation(property, declaration);
      const name = wireName(property);
      const child = record[name];
      if (!(property.flags & ts.SymbolFlags.Optional)) {
        assert.ok(Object.hasOwn(record, name) && child !== undefined,
          `${label}.${name}: required field is missing from the wire payload`);
        const nullable = propertyType.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Null)
          || propertyType.isUnion() && propertyType.types.some(member => member.flags & ts.TypeFlags.Null);
        assert.ok(child !== null || nullable, `${label}.${name}: required field must not be null`);
      }
      visit(propertyType, child, `${label}.${name}`);
    }
    const indexed = checker.getIndexTypeOfType(concrete, ts.IndexKind.String);
    if (indexed) for (const [key, child] of Object.entries(record)) visit(indexed, child, `${label}[${JSON.stringify(key)}]`);
  }
}

// Use the installed declaration's fields, never the surviving converter output,
// to decide which input values must remain observable after decoding.
export function modelFields(modelName: string, wire: unknown, decoded?: unknown): unknown {
  const { checker, models, wireName } = installedContract ??= loadContract();
  let symbol = models.get(modelName);
  assert.ok(symbol, `${modelName} must be exported by the installed SDK`);
  if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
  const inspectDecoded = arguments.length === 3;
  return visit(checker.getDeclaredTypeOfSymbol(symbol), wire, decoded);

  function visit(type: ts.Type, value: any, actual: any): unknown {
    const concrete = checker.getNonNullableType(type);
    if (inspectDecoded && concrete.getSymbol()?.name === "Date" && actual instanceof Date && typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      assert.equal(actual.toISOString().slice(10), "T00:00:00.000Z", "Date-only value acquired a time component");
      return actual.toISOString().slice(0, 10);
    }
    if (value === null || value === undefined || !(concrete.flags & ts.TypeFlags.Object) || concrete.getSymbol()?.name === "Date") {
      return inspectDecoded ? actual : value;
    }
    if (checker.isArrayType(concrete)) {
      assert.ok(Array.isArray(value));
      if (inspectDecoded) { assert.ok(Array.isArray(actual)); assert.equal(actual.length, value.length, "SDK changed array length"); }
      const [item] = checker.getTypeArguments(concrete as ts.TypeReference);
      return value.map((child, index) => visit(item, child, actual?.[index]));
    }
    assert.ok(typeof value === "object" && !Array.isArray(value));
    if (inspectDecoded) assert.ok(actual !== null && typeof actual === "object" && !Array.isArray(actual), "SDK dropped a supported object");
    const output: Record<string, unknown> = {};
    for (const property of checker.getPropertiesOfType(concrete)) {
      const name = wireName(property);
      if (!Object.hasOwn(value, name)) continue;
      const declaration = property.valueDeclaration ?? property.declarations?.[0];
      assert.ok(declaration);
      // Generated converters intentionally map optional null properties to undefined.
      if (value[name] === null && property.flags & ts.SymbolFlags.Optional) {
        if (inspectDecoded) assert.ok(actual[property.name] == null, `${name}: null changed to a value`);
        continue;
      }
      output[name] = visit(checker.getTypeOfSymbolAtLocation(property, declaration), value[name], actual?.[property.name]);
    }
    const item = checker.getIndexTypeOfType(concrete, ts.IndexKind.String);
    if (item) {
      if (inspectDecoded) assert.deepEqual(Object.keys(actual).sort(), Object.keys(value).sort(), "SDK changed dictionary keys");
      for (const [key, child] of Object.entries(value)) output[key] = visit(item, child, actual?.[key]);
    }
    return output;
  }
}
