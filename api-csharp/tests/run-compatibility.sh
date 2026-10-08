#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
for name in TRINSIC_TEST_BASE_URL TRINSIC_TEST_ACCESS_TOKEN TRINSIC_TEST_VERIFICATION_PROFILE_ID; do
  [[ -n "${!name:-}" ]] || { echo "$name is required" >&2; exit 1; }
done

swagger_spec="$(mktemp "${TMPDIR:-/tmp}/trinsic-csharp-swagger.XXXXXX")"
main_worktree="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-csharp-main.XXXXXX")"
main_package_directory="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-csharp-main-package.XXXXXX")"
main_ref="${SDK_COMPATIBILITY_MAIN_REF:-origin/main}"
cleanup() {
  git -C "$REPO_ROOT" worktree remove --force "$main_worktree" 2>/dev/null || true
  rm -rf "$main_package_directory"
  rm -f "$swagger_spec"
}
trap cleanup EXIT

curl --fail --silent --show-error "$TRINSIC_TEST_BASE_URL/swagger/api/swagger.json" --output "$swagger_spec"
"$REPO_ROOT/api-csharp/build-sdk.sh" --swagger-file-or-url "$swagger_spec"
if ! git -C "$REPO_ROOT" rev-parse --verify --quiet "$main_ref" >/dev/null; then
  [[ "$main_ref" == "origin/main" ]] || { echo "Mainline SDK reference $main_ref was not found." >&2; exit 1; }
  git -C "$REPO_ROOT" fetch --no-tags origin main:refs/remotes/origin/main
fi
rmdir "$main_worktree"
git -C "$REPO_ROOT" worktree add --detach "$main_worktree" "$main_ref" >/dev/null
cp "$REPO_ROOT/api-csharp/build-sdk.sh" "$main_worktree/api-csharp/build-sdk.sh"
"$main_worktree/api-csharp/build-sdk.sh" --swagger-file-or-url "$swagger_spec"
main_package=("$main_worktree"/api-csharp/sdk/publish/Trinsic.Api.*.nupkg)
[[ ${#main_package[@]} -eq 1 && -f "${main_package[0]}" ]] || { echo "Expected one $main_ref C# SDK package." >&2; exit 1; }
main_nupkg="$main_package_directory/$(basename "${main_package[0]}")"
cp "${main_package[0]}" "$main_nupkg"
SDK_ORIGIN_MAIN_NUPKG="$main_nupkg" SDK_ORIGIN_MAIN_REVISION="$(git -C "$main_worktree" rev-parse --short HEAD)" SDK_COMPATIBILITY_OPENAPI_SPEC="$swagger_spec" \
  python3 "$SCRIPT_DIR/run_matrix.py"
