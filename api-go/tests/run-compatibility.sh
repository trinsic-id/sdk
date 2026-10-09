#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
for name in TRINSIC_TEST_BASE_URL TRINSIC_TEST_ACCESS_TOKEN TRINSIC_TEST_VERIFICATION_PROFILE_ID; do
  [[ -n "${!name:-}" ]] || { echo "$name is required" >&2; exit 1; }
done

swagger_spec="$(mktemp "${TMPDIR:-/tmp}/trinsic-go-swagger.XXXXXX")"
current_package="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-go-current.XXXXXX")"
main_worktree="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-go-main.XXXXXX")"
main_ref="${SDK_COMPATIBILITY_MAIN_REF:-origin/main}"
cleanup() {
  git -C "$REPO_ROOT" worktree remove --force "$main_worktree" 2>/dev/null || true
  rm -rf "$current_package"
  rm -f "$swagger_spec"
}
trap cleanup EXIT

curl --fail --silent --show-error "${TRINSIC_TEST_BASE_URL%/}/swagger/api/swagger.json" --output "$swagger_spec"
"$REPO_ROOT/api-go/build-sdk.sh" --swagger-file-or-url "$swagger_spec" --output-folder "$current_package"
if ! git -C "$REPO_ROOT" rev-parse --verify --quiet "$main_ref" >/dev/null; then
  [[ "$main_ref" == "origin/main" ]] || { echo "Mainline SDK reference $main_ref was not found." >&2; exit 1; }
  git -C "$REPO_ROOT" fetch --no-tags origin main:refs/remotes/origin/main
fi
rmdir "$main_worktree"
git -C "$REPO_ROOT" worktree add --detach "$main_worktree" "$main_ref" >/dev/null
# Keep the current wrapper so older main revisions can generate from this run's Swagger.
cp "$REPO_ROOT/api-go/build-sdk.sh" "$main_worktree/api-go/build-sdk.sh"
"$main_worktree/api-go/build-sdk.sh" --swagger-file-or-url "$swagger_spec" --output-folder "$main_worktree/api-go/sdk-build"

SDK_GO_CURRENT_PACKAGE="$current_package" \
SDK_GO_MAIN_PACKAGE="$main_worktree/api-go/sdk-build" \
SDK_ORIGIN_MAIN_REVISION="$(git -C "$main_worktree" rev-parse --short HEAD)" \
SDK_COMPATIBILITY_OPENAPI_SPEC="$swagger_spec" \
  node "$SCRIPT_DIR/run_matrix.mjs"
