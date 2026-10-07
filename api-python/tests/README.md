# Python SDK compatibility tests

`run-compatibility.sh` builds the current and `origin/main` Python wheels from
the selected test environment's Swagger document, then tests them alongside
the published PyPI versions listed in `compatibility.json`.

The suite uses the existing `TRINSIC_TEST_BASE_URL`,
`TRINSIC_TEST_ACCESS_TOKEN`, and `TRINSIC_TEST_VERIFICATION_PROFILE_ID`
variables. It writes the shared, language-neutral result envelope to
`SDK_COMPATIBILITY_RESULTS_PATH`; `scripts/sdk-compatibility/run.sh` discovers
the entrypoint automatically and renders its results with every other SDK.

Provider-specific-output checks deserialize Connect's sample JSON using each
installed SDK model and serialize it back with `to_dict()`. Current and main
targets require exact JSON field/value preservation. Published SDKs allow an
older model to omit fields it does not support, and record unavailable public
models as skips.
