#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

find_python() {
  if command -v python >/dev/null 2>&1; then
    command -v python
  elif command -v python3 >/dev/null 2>&1; then
    command -v python3
  else
    echo "Neither 'python' nor 'python3' was found in PATH." >&2
    exit 1
  fi
}

require_env PYPI_API_TOKEN
python_bin="$(find_python)"

shopt -s nullglob
packages=("$SCRIPT_DIR"/sdk/publish/*)
if [[ ${#packages[@]} -eq 0 ]]; then
  echo "No Python packages found in $SCRIPT_DIR/sdk/publish" >&2
  exit 1
fi

echo "Publishing to PyPI"
export TWINE_USERNAME="__token__"
export TWINE_PASSWORD="$PYPI_API_TOKEN"

twine_venv="$(mktemp -d)"
trap 'rm -rf "$twine_venv"' EXIT
"$python_bin" -m venv "$twine_venv"
# shellcheck disable=SC1091
source "$twine_venv/bin/activate"
python -m pip install --upgrade pip twine >/dev/null
twine upload "${packages[@]}"

echo "Published to PyPI"
