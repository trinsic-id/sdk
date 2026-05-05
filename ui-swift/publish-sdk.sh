#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env SDK_REPOSITORY_PATH
require_env MEWMBA_GIT_PUBLISH_TOKEN
require_env COCOAPODS_TRUNK_TOKEN

package_version="$(get_version swiftUIVersion)"

(
  cd "$SCRIPT_DIR/sdk"

  git config --global user.name "github-actions[bot]"
  git config --global user.email "github-actions[bot]@users.noreply.github.com"

  remote_origin="https://$MEWMBA_GIT_PUBLISH_TOKEN@github.com/trinsic-id/sdk-swift-ui.git"
  echo "Setting origin to $remote_origin"
  git remote set-url origin "$remote_origin"

  echo "Checking out main branch"
  git checkout main
  git pull

  podspec_path="TrinsicUI.podspec"
  perl -0pi \
    -e "s/s\\.version\\s*=\\s*'[^']+'/s.version          = '$package_version'/g" \
    -e "s/s\\.source\\s*=\\s*\\{ :git => '[^']+', :tag => '[^']+' \\}/s.source       = { :git => 'https:\\/\\/github.com\\/trinsic-id\\/sdk-swift-ui.git', :tag => '$package_version' }/g" \
    "$podspec_path"
  echo "Podspec file updated with version $package_version."

  echo "Adding files to git"
  git add .

  echo "Committing files"
  git commit -m "Publishing latest ui-swift package for version $package_version"

  echo "Pushing to submodule repository"
  git push origin main

  tag_name="$package_version"
  git tag "$tag_name"
  git push origin "$tag_name"

  cat > "$HOME/.netrc" <<EOF
machine https://github.com
login engineering@trinsic.id
password $COCOAPODS_TRUNK_TOKEN
EOF
  chmod 600 "$HOME/.netrc"

  echo "Pushing to CocoaPods trunk"
  pod trunk push TrinsicUI.podspec
)

(
  cd "$REPO_ROOT"
  remote_origin="https://$MEWMBA_GIT_PUBLISH_TOKEN@github.com/$SDK_REPOSITORY_PATH.git"
  echo "Setting origin to $remote_origin"
  git remote set-url origin "$remote_origin"

  git add "ui-swift/sdk"
  git commit -m "Update ui-swift submodule reference to version $package_version"
  git push origin main
)
