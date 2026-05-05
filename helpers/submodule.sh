#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

source_location=""
destination_location=""
github_pat=""
repository_path=""
package_version=""
name=""
sdk_repository_path=""
tag_prefix="v"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source-location|-sourceLocation)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      source_location="$2"
      ;;
    --destination-location|-destinationLocation)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      destination_location="$2"
      ;;
    --github-pat|-githubPAT)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      github_pat="$2"
      ;;
    --repository-path|-repositoryPath)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      repository_path="$2"
      ;;
    --package-version|-packageVersion)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      package_version="$2"
      ;;
    --name|-name)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      name="$2"
      ;;
    --sdk-repository-path|-sdkRepositoryPath)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      sdk_repository_path="$2"
      ;;
    --tag-prefix|-tagPrefix)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      tag_prefix="$2"
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
  shift 2
done

for required in source_location destination_location github_pat repository_path package_version name sdk_repository_path; do
  if [[ -z "${!required}" ]]; then
    echo "--${required//_/-} is required" >&2
    exit 1
  fi
done

if [[ ! -d "$destination_location" ]]; then
  echo "The destination location '$destination_location' does not exist." >&2
  exit 1
fi
if [[ ! -d "$source_location" ]]; then
  echo "The source location '$source_location' does not exist." >&2
  exit 1
fi

(
  cd "$destination_location"

  git config --global user.name "github-actions[bot]"
  git config --global user.email "github-actions[bot]@users.noreply.github.com"

  remote_origin="https://$github_pat@github.com/$repository_path.git"
  echo "Setting origin to $remote_origin"
  git remote set-url origin "$remote_origin"

  echo "Checking out main branch"
  git checkout main

  if find . -mindepth 1 -maxdepth 1 ! -name .git | grep -q .; then
    echo "There are files or folders other than the .git folder, cleaning."
    git rm -r --cached .
    git clean -fdx
  else
    echo "The only content is the .git folder, or the directory is empty, continuing."
  fi

  echo "Copying source code to destination"
  cp -R "$source_location"/. "$destination_location"/

  echo "Adding files to git"
  git add .

  echo "Committing files"
  git commit -m "Publishing latest $name package for version $package_version"

  echo "Pushing to submodule repository"
  git push origin main

  tag_name="$tag_prefix$package_version"
  git tag "$tag_name"
  git push origin "$tag_name"
)

(
  cd "$REPO_ROOT"
  remote_origin="https://$github_pat@github.com/$sdk_repository_path.git"
  echo "Setting origin to $remote_origin"
  git remote set-url origin "$remote_origin"

  git add "$destination_location"
  git commit -m "Update $name submodule reference to version $package_version"
  git push origin main
)
