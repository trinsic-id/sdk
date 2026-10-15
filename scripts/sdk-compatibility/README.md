# Shared SDK compatibility reporting

`run.sh` discovers `api-*/tests/run-compatibility.sh` suites, runs each suite,
and aggregates their normalized results. Each language suite owns its test
implementation and writes one `compatibility.json` file to the path supplied in
`SDK_COMPATIBILITY_RESULTS_PATH`.

`run.sh` fetches the provider-output fixtures once and shares that snapshot with
every language target. Suites run in parallel by default; set
`SDK_COMPATIBILITY_PARALLEL=false` to run them sequentially when debugging.

`render-results.mjs` is language-agnostic. It validates the common envelope,
aggregates all suite results into `summary.json` and `summary.md`, and renders
optional API-operation and provider-specific-output coverage when a suite
supplies that evidence.

## Result contract

Every suite must write a JSON document with these required fields:

```json
{
  "$schema": "https://trinsic.id/schemas/sdk-compatibility-results-v1.json",
  "schemaVersion": 1,
  "run": { "generatedAt": "<ISO-8601>", "targetBaseUrl": "<URL>" },
  "suite": { "language": "<language>" },
  "testCatalog": [],
  "targets": []
}
```

Each target has a label, optional SDK version, and `testCases`. A test case
records its `id`, `status` (`passed`, `failed`, or `skipped`), and optional
failure, advisory, parameter, or skip-reason details. The shared renderer does
not prescribe how a language runs tests.

Suites may additionally include `apiCoverage`, derived from the shared Swagger
contract for that run. It contains `covered`, `total`, `operations`, and
`unmappedTestCaseIds`. Each operation records its HTTP method, path, operation
ID, and mapped compatibility-test IDs. A suite may report PSO outcomes through
the standard `serialization.provider-output-round-trip` case ID with
`providerId` and optional `sdkModelName` parameters.

## Revision acknowledgements

Use `compatibility.acknowledgements` in the repository-root
`compatibility.json` to document a known, intentional incompatibility for one
published SDK revision. The renderer applies an acknowledgement after the
language suite writes its raw result: a failed matching test becomes skipped
and is shown as an `acknowledged-compatibility-exception` warning. It therefore
does not fail `SDK_COMPATIBILITY_FAIL_ON_FAILURE=true` runs, while its reason
and original result remain in the generated report.

```json
{
  "language": "go",
  "sdkVersion": "3.0.0",
  "testCaseId": "serialization.provider-output-round-trip",
  "parameters": { "providerId": "example-provider" },
  "reason": "The model shape changed intentionally in this release."
}
```

`language`, `sdkVersion`, `testCaseId`, and `reason` are required. `parameters`
is an optional exact, partial match for a case's string parameters; use it to
scope a broad test case such as a PSO check to one provider. Set `mute: true`
to suppress the resulting warning as well. An acknowledgement can also replace
an existing advisory warning for the selected revision.
