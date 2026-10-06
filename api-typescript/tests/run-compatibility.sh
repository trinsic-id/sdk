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
  variable_value="${!variable_name:-}"
  if [[ -z "${variable_value//[[:space:]]/}" ]]; then
    missing_variables+=("$variable_name")
  fi
done

if (( ${#missing_variables[@]} > 0 )); then
  missing_variables_message="${missing_variables[0]}"
  for ((index = 1; index < ${#missing_variables[@]}; index += 1)); do
    missing_variables_message+=", ${missing_variables[index]}"
  done
  printf 'Missing required test configuration: %s.\n' "$missing_variables_message" >&2
  exit 1
fi

test_base_url="${TRINSIC_TEST_BASE_URL%/}"
test_swagger_url="$test_base_url/swagger/api/swagger.json"
swagger_spec="$(mktemp "${TMPDIR:-/tmp}/trinsic-sdk-swagger.XXXXXX")"
main_ref="${SDK_COMPATIBILITY_MAIN_REF:-origin/main}"
origin_main_worktree="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-sdk-origin-main.XXXXXX")"
origin_main_tarball_directory="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-sdk-origin-main-tarball.XXXXXX")"

cleanup() {
  git -C "$REPO_ROOT" worktree remove --force "$origin_main_worktree" 2>/dev/null || true
  rm -rf "$origin_main_tarball_directory"
  rm -f "$swagger_spec"
}
trap cleanup EXIT

curl --fail --silent --show-error "$test_swagger_url" --output "$swagger_spec"

"$REPO_ROOT/api-typescript/build-sdk.sh" \
  --swagger-file-or-url "$swagger_spec"

if ! git -C "$REPO_ROOT" rev-parse --verify --quiet "$main_ref" >/dev/null; then
  if [[ "$main_ref" != "origin/main" ]]; then
    printf 'Mainline SDK reference %s was not found.\n' "$main_ref" >&2
    exit 1
  fi

  git -C "$REPO_ROOT" fetch --no-tags origin \
    main:refs/remotes/origin/main
fi

rmdir "$origin_main_worktree"
git -C "$REPO_ROOT" worktree add --detach "$origin_main_worktree" "$main_ref" >/dev/null

# The baseline source can predate the test-only --swagger-file-or-url option.
# Overlay the current wrapper solely to generate the baseline SDK code from the
# selected target; all generator helpers and SDK source remain in its detached
# worktree.
cp "$REPO_ROOT/api-typescript/build-sdk.sh" "$origin_main_worktree/api-typescript/build-sdk.sh"
"$origin_main_worktree/api-typescript/build-sdk.sh" \
  --swagger-file-or-url "$swagger_spec"

origin_main_tarballs=("$origin_main_worktree"/api-typescript/sdk/publish/trinsic-api-*.tgz)
if (( ${#origin_main_tarballs[@]} != 1 )) || [[ ! -f "${origin_main_tarballs[0]}" ]]; then
  printf 'Expected exactly one %s TypeScript SDK tarball.\n' "$main_ref" >&2
  exit 1
fi

origin_main_tarball="$origin_main_tarball_directory/$(basename "${origin_main_tarballs[0]}")"
cp "${origin_main_tarballs[0]}" "$origin_main_tarball"

cd "$SCRIPT_DIR"
SDK_ORIGIN_MAIN_REVISION="$(git -C "$origin_main_worktree" rev-parse --short HEAD)" \
SDK_ORIGIN_MAIN_TARBALL="$origin_main_tarball" \
SDK_COMPATIBILITY_OPENAPI_SPEC="$swagger_spec" \
  npm run test:matrix
