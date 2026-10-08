#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RUN_ID="${SDK_COMPATIBILITY_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)-$$}"
RESULTS_DIR="${SDK_COMPATIBILITY_RESULTS_DIR:-$REPO_ROOT/test-results/api-sdk-compatibility/$RUN_ID}"
STATUS_FILE="$RESULTS_DIR/suite-status.tsv"
STRICT_MODE="${SDK_COMPATIBILITY_FAIL_ON_FAILURE:-false}"
PARALLEL_MODE="${SDK_COMPATIBILITY_PARALLEL:-true}"

mkdir -p "$RESULTS_DIR"
: > "$STATUS_FILE"

fixture_cache="$RESULTS_DIR/pso-fixtures.json"
if SDK_COMPATIBILITY_PSO_FIXTURES_PATH="$fixture_cache" node --use-system-ca "$SCRIPT_DIR/fetch-pso-fixtures.mjs"; then
  export SDK_COMPATIBILITY_PSO_FIXTURES_PATH="$fixture_cache"
else
  printf 'PSO fixture cache failed; suites will fetch fixtures directly.\n' >&2
  rm -f "$fixture_cache"
fi

run_suite() {
  local language="$1" runner="$2" result_path="$3" status_path="$4"
  set +e
  SDK_COMPATIBILITY_RESULTS_PATH="$result_path" bash "$runner"
  local runner_exit_code=$?
  set -e
  if [[ ! -f "$result_path" ]]; then
    SDK_COMPATIBILITY_FALLBACK_RESULT_PATH="$result_path" SDK_COMPATIBILITY_FALLBACK_LANGUAGE="$language" SDK_COMPATIBILITY_FALLBACK_EXIT_CODE="$runner_exit_code" SDK_COMPATIBILITY_FALLBACK_BASE_URL="${TRINSIC_TEST_BASE_URL:-https://unknown.invalid}" node -e '
      const fs = require("node:fs"); const path = process.env.SDK_COMPATIBILITY_FALLBACK_RESULT_PATH;
      fs.writeFileSync(path, `${JSON.stringify({ $schema: "https://trinsic.id/schemas/sdk-compatibility-results-v1.json", schemaVersion: 1, run: { generatedAt: new Date().toISOString(), targetBaseUrl: process.env.SDK_COMPATIBILITY_FALLBACK_BASE_URL }, suite: { language: process.env.SDK_COMPATIBILITY_FALLBACK_LANGUAGE }, testCatalog: [], targets: [{ isCurrent: true, label: "suite startup", setupFailure: `Runner exited with code ${process.env.SDK_COMPATIBILITY_FALLBACK_EXIT_CODE} before writing a compatibility report. See the preceding suite output.`, testCases: [] }] }, null, 2)}\n`);
    '
  fi
  printf '%s\t%s\n' "$language" "$runner_exit_code" > "$status_path"
}

suite_count=0
declare -a suite_pids=()
for runner in "$REPO_ROOT"/api-*/tests/run-compatibility.sh; do
  [[ -f "$runner" ]] || continue

  api_directory="$(basename "$(dirname "$(dirname "$runner")")")"
  language="${api_directory#api-}"
  result_path="$RESULTS_DIR/$language/compatibility.json"
  mkdir -p "$(dirname "$result_path")"
  suite_count=$((suite_count + 1))

  printf '\n=== Starting %s API SDK compatibility suite ===\n' "$language"
  status_path="$RESULTS_DIR/$language/status.tsv"
  if [[ "$PARALLEL_MODE" == "true" || "$PARALLEL_MODE" == "1" ]]; then
    run_suite "$language" "$runner" "$result_path" "$status_path" & suite_pids+=("$!")
  else
    run_suite "$language" "$runner" "$result_path" "$status_path"
  fi
done

for pid in "${suite_pids[@]}"; do wait "$pid" || true; done
cat "$RESULTS_DIR"/*/status.tsv > "$STATUS_FILE"

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
