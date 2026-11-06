# Python SDK 3.2.1 tests

Run `scripts/run-api-sdk-compatibility.sh python` from the repository root.
See the [shared instructions and result contract](../../scripts/sdk-compatibility/README.md).

The live tests compare supported SDK model fields with the raw response returned
by the capturing SDK client. Unknown wire fields are ignored; list lengths,
pagination, and nested recommendation fields must survive deserialization.
Session tests also check launch URLs, access keys, state, identity data, and attachment content.

Run the offline harness regressions with the published `trinsic-api==3.2.0`
and `pytest` installed:

```sh
TRINSIC_TEST_BASE_URL=https://compatibility.invalid \
TRINSIC_TEST_ACCESS_TOKEN=test-only \
TRINSIC_TEST_VERIFICATION_PROFILE_ID=00000000-0000-0000-0000-000000000000 \
SDK_TARGET_LABEL=python \
SDK_COMPATIBILITY_RESULT_FILE=/tmp/python-harness-results.json \
python -m pytest -q api-python/tests/test_harness.py
```

These regressions use SDK models and a local HTTP server; no live API credentials
are needed. They also run alongside the live cases in the full Python executor.
