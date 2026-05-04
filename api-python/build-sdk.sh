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

"$REPO_ROOT/helpers/generate-client.sh" \
  --language python \
  --output-folder "$SCRIPT_DIR/sdk" \
  --additional-property "packageName=trinsic_api" \
  --additional-property "packageVersion=[VERSION]" \
  --additional-property "packageUrl=https://trinsic.id" \
  --additional-property "projectName=trinsic_api"

cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk"
cp "$REPO_ROOT/LICENSE" "$SCRIPT_DIR/sdk"

setup_file_path="$SCRIPT_DIR/sdk/setup.py"
node - "$setup_file_path" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
const index = lines.findIndex((line) => /^\s*setup\(/.test(line));
if (index >= 0) {
  fs.writeFileSync(file, `${lines.slice(0, index).join("\n")}\n`);
}
NODE

cat >> "$setup_file_path" <<'PYSETUP'
with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name=NAME,
    version=VERSION,
    description="Trinsic API",
    author="trinsic-id",
    author_email="support@trinsic.id",
    url="https://trinsic.id",
    keywords=["Trinsic", "SDK", "Identity verification"],
    install_requires=REQUIRES,
    packages=find_packages(exclude=["test", "tests"]),
    include_package_data=True,
    license_files="LICENSE",
    long_description_content_type='text/markdown',
    long_description=long_description,
    package_data={"trinsic_api": ["py.typed"]},
)
PYSETUP

python_bin="$(find_python)"

(
  cd "$SCRIPT_DIR/sdk"
  "$python_bin" -m venv .venv
  # shellcheck disable=SC1091
  source .venv/bin/activate
  python -m pip install --upgrade pip setuptools wheel
  python setup.py sdist --dist-dir "$SCRIPT_DIR/sdk/publish" bdist_wheel --dist-dir "$SCRIPT_DIR/sdk/publish"
  python -m pip install .
)
