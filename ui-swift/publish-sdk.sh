#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env SDK_REPOSITORY_PATH
require_env MEWMBA_GIT_PUBLISH_TOKEN

package_version="$(get_version swiftUIVersion)"

(
  cd "$SCRIPT_DIR/sdk"

  git config --global user.name "github-actions[bot]"
  git config --global user.email "github-actions[bot]@users.noreply.github.com"

  remote_origin="https://$MEWMBA_GIT_PUBLISH_TOKEN@github.com/trinsic-id/sdk-swift-ui.git"
  echo "Configuring authenticated publishing remote"
  git remote set-url origin "$remote_origin"

  echo "Checking out main branch"
  git checkout main
  git pull

  tag_name="$package_version"
  git tag "$tag_name"
  git push origin "$tag_name"
)

(
  cd "$REPO_ROOT"
  remote_origin="https://$MEWMBA_GIT_PUBLISH_TOKEN@github.com/$SDK_REPOSITORY_PATH.git"
  echo "Configuring authenticated publishing remote"
  git remote set-url origin "$remote_origin"

  git add "ui-swift/sdk"
  if ! git diff --cached --quiet -- "ui-swift/sdk"; then
    git commit -m "Update ui-swift submodule reference to version $package_version"
    git push origin main
  fi
)
