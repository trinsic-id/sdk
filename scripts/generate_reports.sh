#!/usr/bin/env bash

# Regenerate the SDK compatibility reports and export focused API and PSO PDFs.
# Usage: ./scripts/generate_reports.sh [results-directory]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPOSITORY_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ $# -gt 1 ]]; then
  echo "Usage: $0 [results-directory]" >&2
  exit 2
fi

if [[ $# -eq 1 ]]; then
  RESULTS_DIR="$(cd "$1" && pwd)"
else
  RESULTS_DIR="$(find "$REPOSITORY_ROOT/test-results/api-sdk-compatibility" \
    -mindepth 1 -maxdepth 1 -type d -exec test -f '{}/suite-status.tsv' ';' -print \
    2>/dev/null | sort -r | head -n 1)"
fi

if [[ -z "${RESULTS_DIR:-}" || ! -f "$RESULTS_DIR/suite-status.tsv" ]]; then
  echo "No compatibility result directory with suite-status.tsv was found." >&2
  echo "Run the compatibility suite first, or pass its results directory explicitly." >&2
  exit 1
fi

node "$SCRIPT_DIR/sdk-compatibility/render-results.mjs" \
  --results-dir "$RESULTS_DIR" \
  --status-file "$RESULTS_DIR/suite-status.tsv"

PDF_WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/sdk-compatibility-report.XXXXXX")"
trap 'rm -rf "$PDF_WORK_DIR"' EXIT
render_pdf() {
  local report_name="$1"
  npx --yes @markdown-viewer/documd \
    "$RESULTS_DIR/$report_name.md" \
    "$PDF_WORK_DIR/$report_name.html"
  node "$SCRIPT_DIR/sdk-compatibility/prepare-pso-pdf.mjs" \
    "$PDF_WORK_DIR/$report_name.html" \
    "$PDF_WORK_DIR/$report_name-print.html"
  if ! "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless \
    --disable-gpu \
    --no-pdf-header-footer \
    --print-to-pdf="$RESULTS_DIR/$report_name.pdf" \
    "file://$PDF_WORK_DIR/$report_name-print.html" \
    2>"$PDF_WORK_DIR/$report_name-chrome.log"; then
    cat "$PDF_WORK_DIR/$report_name-chrome.log" >&2
    exit 1
  fi
}

render_pdf "api-summary"
render_pdf "pso-summary"

npx --yes @markdown-viewer/documd \
  "$RESULTS_DIR/pso-chart-variations.md" \
  "$RESULTS_DIR/pso-chart-variations.pdf"

echo "API Compatibility Summary: $RESULTS_DIR/api-summary.pdf"
echo "Provider Specific Output Summary: $RESULTS_DIR/pso-summary.pdf"
echo "Chart variations: $RESULTS_DIR/pso-chart-variations.pdf"
