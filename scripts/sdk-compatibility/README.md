# SDK 3.2.1 contract tests

This test snapshot installs the published **3.2.1** API SDK for C#, Go, Java,
Python, Ruby, and TypeScript. It does not generate SDKs or test multiple
package versions. Connect owns the matrix of snapshot commits and the exception
policy. Use a new branch/tagged snapshot for another SDK release.

## Run

Provide `TRINSIC_TEST_BASE_URL`, `TRINSIC_TEST_ACCESS_TOKEN`, and
`TRINSIC_TEST_VERIFICATION_PROFILE_ID` for a test environment with the
`trinsic-test-redirect` provider and a registered HTTP(S) redirect URI.
Do not commit credentials.

```sh
scripts/run-api-sdk-compatibility.sh              # all six SDKs
scripts/run-api-sdk-compatibility.sh csharp       # one SDK while developing
node --test scripts/sdk-compatibility/harness.test.mjs
```

The full run needs Node 22.19+ (or a newer release with `--use-system-ca`),
Python 3.9+ with venv, .NET 8+, Go, Java 21/Maven, and
Ruby 3.3+/Bundler. Installations use temporary directories, except the locked
TypeScript test dependencies installed with `npm ci` in `api-typescript/tests`.
The language executors install exact SDK versions. The C# and Java project files
also pin 3.2.1 directly. No package-path or SDK-version override is supported.

Live tests create hosted/direct sessions through each real SDK. They exercise
reads, cancellation, results, attachments, redaction, and recommendations. The
redirect test provider supplies synthetic verification data. HTTP redirect
helpers perform the browser portion; SDK operations still use SDK serializers.
API assertions check requested IDs, session completion/success state, launch
URLs and access keys, recommendation/page shapes, and decoded PNG attachment
contents. Transport checks verify pagination, provider/profile IDs, capabilities,
and explicit `false` request values. Native regressions inject invalid values and
dropped fields to prove these checks fail.
Offline response-model regressions deserialize session pages and recommendations
with each published SDK, then deliberately drop entries or change IDs, pagination,
countries, and nested sub-provider fields. Unchanged empty/nonempty pages and
unknown response fields must still pass. C#, Go, Java, Ruby, and TypeScript check
both recommendation lists (`recommendedProviders` and `remainder`). These checks
run with the normal native harness regressions and do not call the live API.
Tests attempt cancellation during cleanup, including after assertion failures;
completed/redacted sessions may no longer be cancellable.
Each live case records its own outcome. TypeScript shares browser-completed
session setup lazily, while result decoding stays inside the result/attachment
cases so a decoding failure cannot suppress redaction or unrelated operations.

## Contract coverage

The collector fetches the current public provider fixture catalog and complete
wire payloads once, then shares them across the six suites. SDK deserializers
receive those payloads unchanged. Serialization comparisons omit read-only
fields and retain legacy aliases; they compare the fields the old model exposes,
while synthetic fixtures require their expected fields to survive exactly.
The installed model metadata determines which fields must survive decoding,
including nested objects, arrays, dictionaries, and read-only properties.
Round-trip checks require supported fields rather than only comparing the fields
that happen to remain. Scalar checks distinguish booleans from numbers;
Ruby timestamp equality retains fractional seconds.
The suite also exercises unknown fields, nested model
dictionaries, and the Singpass legacy wire alias.

TypeScript and Java also check required fields against the installed release's
model metadata before decoding provider fixtures, including nested objects,
arrays, and dictionaries. Missing required fields remain raw compatibility
failures; optional fields and unknown response fields remain allowed. A field
required by one release may be optional in another release's snapshot.

Future enum values are deferred to a separate phase. First investigate improving
the SDK generators/serializers to tolerate unknown enum values while preserving
the rest of the response. Then restore a synthetic `IntegrationStep` fixture with
an unknown `method` value and decide in Connect which remaining incompatibilities
to ignore. This phase adds no synthetic unknown-enum case or blanket exception;
enum errors encountered in real API responses still surface as raw failures.

The 3.2.1 snapshot binds `a-itsme-login` to `ItsmeLoginProviderOutput` and the
direct `itsme` provider to `ItsmeProviderOutput`. Both integrations are tested.
Each language resolves models from its installed package:
absent models are skipped, while errors decoding an available model remain failures.
Providers with no public SDK model in Connect's catalog are also skipped.

`provider-models.json` records the 65 public provider/model bindings discovered in
the published 3.2.1 packages. These fixtures and the synthetic cases set
`modelRequired: true`: a missing payload, missing model, or skipped result fails
the run. New remote providers are still checked against the installed SDK; their
models do not need to appear in this baseline to be tested. This inventory prevents
later catalog changes from silently shrinking coverage and preserves historical
model names. It is SDK test data, not a Connect exception list.

## Structured results consumed by Connect

`test-results/sdk-3.2.1/compatibility.json` contains:

```json
{
  "schemaVersion": 2,
  "sdkVersion": "3.2.1",
  "run": {
    "generatedAt": "ISO-8601 timestamp",
    "scope": "full",
    "commit": "checked-out SDK test commit",
    "targetBaseUrl": "https://api.example.test"
  },
  "fixtures": [
    { "providerId": "provider", "sdkModelName": "ProviderOutput",
      "hasPublicSdkModel": true, "modelRequired": true,
      "testCaseId": "serialization.provider-output-round-trip" }
  ],
  "suites": [
    { "language": "csharp", "sdkVersion": "3.2.1", "testCases": [
      { "id": "serialization.provider-output-round-trip", "status": "failed",
        "durationMs": 1, "parameters": { "providerId": "provider", "sdkModelName": "ProviderOutput" },
        "failure": { "name": "JsonException", "message": "Deserialization error details" } }
    ] }
  ]
}
```

Statuses are `passed`, `failed`, or `skipped`; skipped cases include `skipReason`.
Unsupported provider models are explicit skips, not failures needing exceptions.
Setup, missing coverage, malformed native reports, and unrecorded native failures
use `framework.*` case IDs. `compatibility-tests.json` lists the required cases.
Native TRX, JUnit, Go JSON, and Minitest results are reconciled with the SDK cases;
one recorded incompatibility cannot account for an independent native failure.
Ruby runs its harness regressions and SDK cases together so both sets of outcomes
survive even when one fails.
Raw language results and fixtures remain alongside the combined report. A rerun
replaces previous results. Exit 0 means no raw failures; exit 1 means failures.
There is **no exception handling in the SDK repository**: Connect consumes the
raw report, applies explicitly scoped exceptions, and writes a separate verdict.
It verifies the expected SDK version, checkout commit, environment, languages,
required cases, and per-provider coverage. A required model cannot be skipped,
and even unsupported providers must have exactly one outcome per language.
Framework failures cannot be ignored.

Set `SDK_COMPATIBILITY_RESULTS_DIR` to choose an output directory.
`SDK_COMPATIBILITY_PSO_FIXTURES_PATH` may supply a previously captured wire cache
for offline debugging. `SDK_COMPATIBILITY_TEST_SCOPE=serialization` skips live
session operations. Partial runs remain marked as such and cannot pass Connect's
full compatibility gate. These diagnostics still report raw contract failures.
