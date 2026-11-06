# Shared SDK compatibility reporting

`run.sh` discovers `api-*/tests/run-compatibility.sh` suites, runs each suite,
and aggregates their normalized results. Each language suite owns its test
implementation and writes one `compatibility.json` file to the path supplied in
`SDK_COMPATIBILITY_RESULTS_PATH`.

`run.sh` fetches the provider-output fixtures once and shares that snapshot with
every language target. Suites run in parallel by default; set
`SDK_COMPATIBILITY_PARALLEL=false` to run them sequentially when debugging.
Each invocation removes the previous per-language report before starting its
runner, so a build failure cannot reuse an earlier successful report.

The collector retains the complete API response in `output`. SDK deserializers
therefore see unknown fields and legacy aliases exactly as clients do.
`serializationOutput` contains current Swagger fields excluding `readOnly`
properties; `legacySerializationOutput` also retains aliases absent from today's
Swagger, for published SDKs. No filtering is applied to deserialization input.

The coordinator applies `compatibility.providerMappings` by published version.
An old model name is matched to its original provider; an explicitly unsupported
new provider is reported separately. Current and mainline targets never inherit
historical mappings. `compatibility.wireAliases` checks retained aliases against
their replacement fields, so removing an alias from the server fails the suite.

Every target also receives synthetic fixtures for unknown fields, future enum
values, and nested model dictionaries (including mDL namespaces). Enum tests
require the response to parse and preserve known fields; a language may preserve
the new enum string or return an explicit unknown sentinel.

All seven languages must report the shared test catalog. The aggregate command
fails on unexpected compatibility or setup failures by default. Explicitly set
`SDK_COMPATIBILITY_FAIL_ON_FAILURE=false` only for a report-only diagnostic run.
Missing public model exports fail current/main targets; there is no exemption.

Every standalone language entry point prepares the same raw cache when
`SDK_COMPATIBILITY_PSO_FIXTURES_PATH` is not supplied. Missing or empty caches
fail setup. All entry points use the repository's release generator configuration.

Baseline targets run the selected revision's build wrapper and generator helper
from its detached worktree, preserving that revision's options and post-processing.
`build-baseline.sh` redirects only the Swagger input and skips Ruby's user-level
gem installation after packaging.

Run the local harness regressions without Connect credentials:

```sh
node --test scripts/sdk-compatibility/harness.test.mjs
```

The native test projects also include `CompatibilityHarnessTest` (Java) and
`HarnessRegressionTests` (C#) for callback handling and JSON comparison regressions.
C# and Java reconcile their TRX/Surefire failures against the native test that
emitted each compatibility failure. Unrecorded native failures remain framework
failures even when an SDK failure is acknowledged. Reading those native XML
reports requires `python3` (standard library only). Ruby runs its local URL
configuration regressions separately before compatibility tests.

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
Current-branch and `origin/main` targets never receive published-revision
acknowledgements, even if they share the published package's version number.

```json
{
  "language": "go",
  "sdkVersion": "3.0.0",
  "testCaseId": "serialization.provider-output-round-trip",
  "parameters": { "providerId": "example-provider" },
  "reason": "The model shape changed intentionally in this release.",
  "failureMessageIncludes": ["givenName"]
}
```

`language`, `sdkVersion`, `testCaseId`, and `reason` are required. A failure is
acknowledged only when every string in the nonempty `failureMessageIncludes`
array occurs in its message; another failure of the same case still fails CI. `parameters`
is an optional exact, partial match for a case's string parameters; use it to
scope a broad test case such as a PSO check to one provider. Set `mute: true`
to suppress the resulting warning as well. An acknowledgement can also replace
an existing advisory warning for the selected revision.

## Serialization-only diagnostics

Set `SDK_COMPATIBILITY_TEST_SCOPE=serialization` when invoking a language's
single-target `run_matrix.mjs` executor to exercise codecs without API operations.
Provide a fixture cache plus the normal target/result environment variables.
This is a partial diagnostic run, not a replacement for the full CI catalog.
The C# executor detects the installed package's client architecture and exercises
its own HTTP codec (System.Text.Json for historical generichost packages,
CustomJsonCodec/Newtonsoft for httpclient packages).
