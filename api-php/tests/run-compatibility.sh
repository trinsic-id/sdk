#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
for name in TRINSIC_TEST_BASE_URL TRINSIC_TEST_ACCESS_TOKEN TRINSIC_TEST_VERIFICATION_PROFILE_ID; do
  [[ -n "${!name:-}" ]] || { echo "$name is required" >&2; exit 1; }
done
command -v composer >/dev/null || { echo "composer is required" >&2; exit 1; }
swagger_spec="$(mktemp "${TMPDIR:-/tmp}/trinsic-php-swagger.XXXXXX")"
main_worktree="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-php-main.XXXXXX")"
main_package="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-php-main-package.XXXXXX")"
current_package="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-php-current.XXXXXX")"
cleanup() { git -C "$REPO_ROOT" worktree remove --force "$main_worktree" 2>/dev/null || true; rm -rf "$main_package" "$current_package"; rm -f "$swagger_spec"; }
trap cleanup EXIT
curl --fail --silent --show-error "$TRINSIC_TEST_BASE_URL/swagger/api/swagger.json" --output "$swagger_spec"
"$REPO_ROOT/api-php/build-sdk.sh" --swagger-file-or-url "$swagger_spec" --output-folder "$current_package"
git -C "$REPO_ROOT" fetch --no-tags origin main:refs/remotes/origin/main 2>/dev/null || true
rmdir "$main_worktree"
git -C "$REPO_ROOT" worktree add --detach "$main_worktree" "${SDK_COMPATIBILITY_MAIN_REF:-origin/main}" >/dev/null
cp "$REPO_ROOT/api-php/build-sdk.sh" "$main_worktree/api-php/build-sdk.sh"
cp "$REPO_ROOT/helpers/generate-client.sh" "$main_worktree/helpers/generate-client.sh"
"$main_worktree/api-php/build-sdk.sh" --swagger-file-or-url "$swagger_spec" --output-folder "$main_package"
SDK_COMPATIBILITY_CURRENT_PACKAGE="$current_package" SDK_COMPATIBILITY_MAIN_PACKAGE="$main_package" SDK_ORIGIN_MAIN_REVISION="$(git -C "$main_worktree" rev-parse --short HEAD)" SDK_COMPATIBILITY_OPENAPI_SPEC="$swagger_spec" SDK_COMPATIBILITY_PACKAGE_LABEL="trinsic/api" node "$REPO_ROOT/scripts/sdk-compatibility/run-matrix.mjs" php node "$SCRIPT_DIR/run_matrix.mjs"
