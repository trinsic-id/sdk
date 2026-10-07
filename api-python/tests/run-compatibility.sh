#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

required_variables=(
  TRINSIC_TEST_BASE_URL
  TRINSIC_TEST_ACCESS_TOKEN
  TRINSIC_TEST_VERIFICATION_PROFILE_ID
)
missing_variables=()
for variable_name in "${required_variables[@]}"; do
  if [[ -z "${!variable_name:-}" ]]; then
    missing_variables+=("$variable_name")
  fi
done
if (( ${#missing_variables[@]} > 0 )); then
  printf 'Missing required test configuration: %s.\n' "$(IFS=', '; echo "${missing_variables[*]}")" >&2
  exit 1
fi

python_bin="$(command -v python3 || command -v python)"
test_base_url="${TRINSIC_TEST_BASE_URL%/}"
swagger_spec="$(mktemp "${TMPDIR:-/tmp}/trinsic-python-sdk-swagger.XXXXXX")"
main_worktree="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-python-sdk-main.XXXXXX")"
main_wheel_directory="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-python-sdk-main-wheel.XXXXXX")"
main_ref="${SDK_COMPATIBILITY_MAIN_REF:-origin/main}"

cleanup() {
  git -C "$REPO_ROOT" worktree remove --force "$main_worktree" 2>/dev/null || true
  rm -rf "$main_wheel_directory"
  rm -f "$swagger_spec"
}
trap cleanup EXIT

curl --fail --silent --show-error "$test_base_url/swagger/api/swagger.json" --output "$swagger_spec"
"$REPO_ROOT/api-python/build-sdk.sh" --swagger-file-or-url "$swagger_spec"

if ! git -C "$REPO_ROOT" rev-parse --verify --quiet "$main_ref" >/dev/null; then
  [[ "$main_ref" == "origin/main" ]] || { printf 'Mainline SDK reference %s was not found.\n' "$main_ref" >&2; exit 1; }
  git -C "$REPO_ROOT" fetch --no-tags origin main:refs/remotes/origin/main
fi

rmdir "$main_worktree"
git -C "$REPO_ROOT" worktree add --detach "$main_worktree" "$main_ref" >/dev/null
# Older baseline revisions did not accept --swagger-file-or-url. Only the wrapper
# is overlaid; the generator configuration remains that revision's configuration.
cp "$REPO_ROOT/api-python/build-sdk.sh" "$main_worktree/api-python/build-sdk.sh"
"$main_worktree/api-python/build-sdk.sh" --swagger-file-or-url "$swagger_spec"

main_wheels=("$main_worktree"/api-python/sdk/publish/trinsic_api-*.whl)
if (( ${#main_wheels[@]} != 1 )) || [[ ! -f "${main_wheels[0]}" ]]; then
  printf 'Expected exactly one %s Python SDK wheel.\n' "$main_ref" >&2
  exit 1
fi
main_wheel="$main_wheel_directory/$(basename "${main_wheels[0]}")"
cp "${main_wheels[0]}" "$main_wheel"

SDK_ORIGIN_MAIN_REVISION="$(git -C "$main_worktree" rev-parse --short HEAD)" \
SDK_ORIGIN_MAIN_WHEEL="$main_wheel" \
SDK_COMPATIBILITY_OPENAPI_SPEC="$swagger_spec" \
  "$python_bin" "$SCRIPT_DIR/run_matrix.py"
