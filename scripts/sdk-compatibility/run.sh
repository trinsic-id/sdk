#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RUN_ID="${SDK_COMPATIBILITY_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)-$$}"
RESULTS_DIR="${SDK_COMPATIBILITY_RESULTS_DIR:-$REPO_ROOT/test-results/api-sdk-compatibility/$RUN_ID}"
STATUS_FILE="$RESULTS_DIR/suite-status.tsv"
STRICT_MODE="${SDK_COMPATIBILITY_FAIL_ON_FAILURE:-false}"

mkdir -p "$RESULTS_DIR"
: > "$STATUS_FILE"

suite_count=0
for runner in "$REPO_ROOT"/api-*/tests/run-compatibility.sh; do
  [[ -f "$runner" ]] || continue

  api_directory="$(basename "$(dirname "$(dirname "$runner")")")"
  language="${api_directory#api-}"
  result_path="$RESULTS_DIR/$language/compatibility.json"
  mkdir -p "$(dirname "$result_path")"
  suite_count=$((suite_count + 1))

  printf '\n=== Running %s API SDK compatibility suite ===\n' "$language"
  set +e
  SDK_COMPATIBILITY_RESULTS_PATH="$result_path" bash "$runner"
  runner_exit_code=$?
  set -e

  if [[ ! -f "$result_path" ]]; then
    SDK_COMPATIBILITY_FALLBACK_RESULT_PATH="$result_path" \
    SDK_COMPATIBILITY_FALLBACK_LANGUAGE="$language" \
    SDK_COMPATIBILITY_FALLBACK_EXIT_CODE="$runner_exit_code" \
    SDK_COMPATIBILITY_FALLBACK_BASE_URL="${TRINSIC_TEST_BASE_URL:-https://unknown.invalid}" \
    node -e '
      const fs = require("node:fs");
      const path = process.env.SDK_COMPATIBILITY_FALLBACK_RESULT_PATH;
      const report = {
        $schema: "https://trinsic.id/schemas/sdk-compatibility-results-v1.json",
        schemaVersion: 1,
        run: {
          generatedAt: new Date().toISOString(),
          targetBaseUrl: process.env.SDK_COMPATIBILITY_FALLBACK_BASE_URL,
        },
        suite: { language: process.env.SDK_COMPATIBILITY_FALLBACK_LANGUAGE },
        testCatalog: [],
        targets: [{
          isCurrent: true,
          label: "suite startup",
          setupFailure: `Runner exited with code ${process.env.SDK_COMPATIBILITY_FALLBACK_EXIT_CODE} before writing a compatibility report. See the preceding suite output.`,
          testCases: [],
        }],
      };
      fs.writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
    '
  fi

  printf '%s\t%s\n' "$language" "$runner_exit_code" >> "$STATUS_FILE"
done

if (( suite_count == 0 )); then
  printf 'No API SDK compatibility suites were found.\n' >&2
  exit 1
fi

renderer_arguments=(
  --results-dir "$RESULTS_DIR"
  --status-file "$STATUS_FILE"
)
if [[ "$STRICT_MODE" == "true" || "$STRICT_MODE" == "1" ]]; then
  renderer_arguments+=(--check)
fi
node "$SCRIPT_DIR/render-results.mjs" "${renderer_arguments[@]}"

printf '\nCompatibility artifacts: %s\n' "$RESULTS_DIR"
