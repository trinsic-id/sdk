# SDK 3.2.0 contract tests

This test snapshot installs the published **3.2.0** API SDK for C#, Go, Java,
PHP, Python, Ruby, and TypeScript. It does not generate SDKs or test multiple
package versions. Connect owns the matrix of snapshot commits and the exception
policy. Use a new branch/tagged snapshot for another SDK release.

## Run

Provide `TRINSIC_TEST_BASE_URL`, `TRINSIC_TEST_ACCESS_TOKEN`, and
`TRINSIC_TEST_VERIFICATION_PROFILE_ID` for a test environment with the
`trinsic-test-redirect` provider and a registered HTTP(S) redirect URI.
Do not commit credentials.

```sh
scripts/run-api-sdk-compatibility.sh              # all seven SDKs
scripts/run-api-sdk-compatibility.sh csharp       # one SDK while developing
node --test scripts/sdk-compatibility/harness.test.mjs
```

The full run needs Node 22.19+ (or a newer release with `--use-system-ca`),
Python 3.9+ with venv, .NET 8+, Go, Java 21/Maven, PHP 8.3+/Composer, and
Ruby 3.3+/Bundler. Installations use temporary directories, except the locked
TypeScript test dependencies installed with `npm ci` in `api-typescript/tests`.
The language executors install exact SDK versions. The C# and Java project files
also pin 3.2.0 directly. No package-path or SDK-version override is supported.

Live tests create hosted/direct sessions through each real SDK. They exercise
reads, cancellation, results, attachments, redaction, and recommendations. The
redirect test provider supplies synthetic verification data. HTTP redirect
helpers perform the browser portion; SDK operations still use SDK serializers.
Tests attempt cancellation during cleanup, including after assertion failures;
completed/redacted sessions may no longer be cancellable.

## Contract coverage

The collector fetches the current public provider fixture catalog and complete
wire payloads once, then shares them across the seven suites. SDK deserializers
receive those payloads unchanged. Serialization comparisons omit read-only
fields and retain legacy aliases; they compare the fields the old model exposes,
while synthetic fixtures require their expected fields to survive exactly.
The suite also exercises unknown fields, nested model
dictionaries, and the Singpass legacy wire alias.

Future enum values are deferred to a separate phase. First investigate improving
the SDK generators/serializers to tolerate unknown enum values while preserving
the rest of the response. Then restore a synthetic `IntegrationStep` fixture with
an unknown `method` value and decide in Connect which remaining incompatibilities
to ignore. This phase adds no synthetic unknown-enum case or blanket exception;
enum errors encountered in real API responses still surface as raw failures.

The 3.2.0 snapshot binds `a-itsme-login` to its original `ItsmeProviderOutput`.
The later direct `itsme` provider has no corresponding model and is reported as
unsupported. Each language resolves the other models from its installed package:
absent models are skipped, while errors decoding an available model remain failures.
Providers with no public SDK model in Connect's catalog are also skipped.

`provider-models.json` records the 51 public provider/model bindings discovered in
all seven published 3.2.0 packages. These fixtures and the synthetic cases set
`modelRequired: true`: a missing payload, missing model, or skipped result fails
the run. New remote providers are still checked against the installed SDK; their
models do not need to appear in this baseline to be tested. This inventory prevents
later catalog changes from silently shrinking coverage and preserves historical
model names. It is SDK test data, not a Connect exception list.

## Structured results consumed by Connect

`test-results/sdk-3.2.0/compatibility.json` contains:

```json
{
  "schemaVersion": 2,
  "sdkVersion": "3.2.0",
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
    { "language": "csharp", "sdkVersion": "3.2.0", "testCases": [
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
