#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env SDK_REPOSITORY_PATH
require_env MEWMBA_GIT_PUBLISH_TOKEN

(
  cd "$SCRIPT_DIR/sdk"

  git config --global user.name "github-actions[bot]"
  git config --global user.email "github-actions[bot]@users.noreply.github.com"

  remote_origin="https://$MEWMBA_GIT_PUBLISH_TOKEN@github.com/trinsic-id/sdk-android-ui.git"
  echo "Setting origin to $remote_origin"
  git remote set-url origin "$remote_origin"

  echo "Checking out main branch"
  git checkout main
  git pull

  echo "Adding files to git"
  git add .

  package_version="$(get_version androidUIVersion)"

  echo "Committing files"
  git commit -m "Publishing latest ui-android package for version $package_version"

  echo "Pushing to submodule repository"
  git push origin main

  tag_name="$package_version"
  git tag "$tag_name"
  git push origin "$tag_name"
)

(
  cd "$REPO_ROOT"
  remote_origin="https://$MEWMBA_GIT_PUBLISH_TOKEN@github.com/$SDK_REPOSITORY_PATH.git"
  echo "Setting origin to $remote_origin"
  git remote set-url origin "$remote_origin"

  git add "ui-android/sdk"
  git commit -m "Update ui-android submodule reference to version $(get_version androidUIVersion)"
  git push origin main
)
