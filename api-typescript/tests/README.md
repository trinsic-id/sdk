# TypeScript API Compatibility Tests

Requires Node 22 and these environment variables:

```sh
export TRINSIC_TEST_BASE_URL="https://<Connect-host>"
export TRINSIC_TEST_ACCESS_TOKEN="..."
export TRINSIC_TEST_VERIFICATION_PROFILE_ID="..."
```

Install dependencies once:

```sh
npm ci
npm --prefix api-typescript/tests ci
```

Run every available API SDK compatibility suite:

```sh
scripts/run-api-sdk-compatibility.sh
```

The runner prints a per-language/per-SDK summary and writes JSON and Markdown
artifacts under `test-results/api-sdk-compatibility/<run-id>/`. It reports
known failures but exits successfully by default. To fail on reported issues:

```sh
SDK_COMPATIBILITY_FAIL_ON_FAILURE=true scripts/run-api-sdk-compatibility.sh
```

To run TypeScript only:

```sh
npm --prefix api-typescript/tests run test:compatibility
```
