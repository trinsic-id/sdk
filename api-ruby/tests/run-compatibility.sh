#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
for key in TRINSIC_TEST_BASE_URL TRINSIC_TEST_ACCESS_TOKEN TRINSIC_TEST_VERIFICATION_PROFILE_ID; do [[ -n "${!key:-}" ]] || { echo "$key is required" >&2; exit 1; }; done
swagger="$(mktemp "${TMPDIR:-/tmp}/trinsic-ruby-swagger.XXXXXX")"; main="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-ruby-main.XXXXXX")"; current="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-ruby-current.XXXXXX")"
cleanup(){ git -C "$REPO_ROOT" worktree remove --force "$main" 2>/dev/null || true; rm -rf "$current"; rm -f "$swagger"; }; trap cleanup EXIT
curl -fsS "$TRINSIC_TEST_BASE_URL/swagger/api/swagger.json" -o "$swagger"
SDK_COMPATIBILITY_SKIP_INSTALL=true "$REPO_ROOT/api-ruby/build-sdk.sh" --swagger-file-or-url "$swagger" --output-folder "$current"
rmdir "$main"; git -C "$REPO_ROOT" worktree add --detach "$main" "${SDK_COMPATIBILITY_MAIN_REF:-origin/main}" >/dev/null; cp "$REPO_ROOT/api-ruby/build-sdk.sh" "$main/api-ruby/build-sdk.sh"; SDK_COMPATIBILITY_SKIP_INSTALL=true "$main/api-ruby/build-sdk.sh" --swagger-file-or-url "$swagger" --output-folder "$main/api-ruby/sdk-build"
SDK_COMPATIBILITY_CURRENT_PACKAGE="$current" SDK_COMPATIBILITY_MAIN_PACKAGE="$main/api-ruby/sdk-build" SDK_ORIGIN_MAIN_REVISION="$(git -C "$main" rev-parse --short HEAD)" SDK_COMPATIBILITY_OPENAPI_SPEC="$swagger" SDK_COMPATIBILITY_PACKAGE_LABEL="trinsic_api" node "$REPO_ROOT/scripts/sdk-compatibility/run-matrix.mjs" ruby node "$SCRIPT_DIR/run_matrix.mjs"
