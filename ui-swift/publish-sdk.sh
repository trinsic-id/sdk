#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env SDK_REPOSITORY_PATH
require_env MEWMBA_GIT_PUBLISH_TOKEN

package_version="$(get_version swiftUIVersion)"

# Keep credentials out of remote URLs and retain authentication across GitHub redirects.
# Apply the header only to GitHub requests made by these publishing commands.
git_authenticated() {
  GIT_PUBLISH_AUTH_HEADER="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$MEWMBA_GIT_PUBLISH_TOKEN" | base64 | tr -d '\r\n')" \
    git --config-env=http.https://github.com/.extraheader=GIT_PUBLISH_AUTH_HEADER "$@"
}

(
  cd "$SCRIPT_DIR/sdk"

  git config --global user.name "github-actions[bot]"
  git config --global user.email "github-actions[bot]@users.noreply.github.com"

  remote_origin="https://github.com/trinsic-id/sdk-swift-ui.git"
  echo "Configuring publishing remote"
  git remote set-url origin "$remote_origin"

  echo "Checking out main branch"
  git checkout main
  git_authenticated pull

  tag_name="$package_version"
  git tag "$tag_name"
  git_authenticated push origin "$tag_name"
)

(
  cd "$REPO_ROOT"
  remote_origin="https://github.com/$SDK_REPOSITORY_PATH.git"
  echo "Configuring publishing remote"
  git remote set-url origin "$remote_origin"

  git add "ui-swift/sdk"
  if ! git diff --cached --quiet -- "ui-swift/sdk"; then
    git commit -m "Update ui-swift submodule reference to version $package_version"
    git_authenticated push origin main
  fi
)
