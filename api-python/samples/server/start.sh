#!/usr/bin/env sh
# Set -e: Error when a command fails (causes script to fail fast)
# Set -u: Error when an env var isn't set
set -eu
# Pipefail that works in sh, bash, zsh, etc
set -o pipefail 2>/dev/null || true
trap 'rc=$?; [ $rc -eq 0 ] || echo "ERROR: exit=$rc at line ${LINENO:-?}" >&2' EXIT

# Specify which python version we want to use
TARGET_PYTHON_VERSION="${TARGET_PYTHON_VERSION:-3.13}"

# Specify which python version is the mimimum allowed
MIN_PYTHON_VERSION="${MIN_PYTHON_VERSION:-3.10}"

# This function compares two version strings. First is current version, second is minimum version
ver_ge() {
    cur=$1
    min=$2

    # Regex current version parts
    cur_major=${cur%%.*}
    cur_rest=${cur#*.}
    cur_minor=${cur_rest%%.*}

    # Regex minimum version parts
    min_major=${min%%.*}
    min_rest=${min#*.}
    min_minor=${min_rest%%.*}

    # We only target major version 3
    [ "$cur_major" = "3" ] || return 1

    # Current should be ge minimum
    [ "$cur_minor" -ge "$min_minor" ] 2>/dev/null
}

# Gets the script's directory regardless if it's invoked via PATH or not
case $0 in
    */*) script=$0 ;;
    *)
        script=$(command -v -- "$0" 2>/dev/null || true)
        [ -n "${script:-}" ] || script="./$0"
        ;;
esac
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$script")" && pwd -P)
echo "[*] Script directory: $SCRIPT_DIR ℹ️"

# Load variables from .env if present in script's directory
if [ -f ${SCRIPT_DIR}/.env ]; then
    echo "[*] Using .env found in script directory 🔍"
    set -a
    . ${SCRIPT_DIR}/.env
    set +a
fi

# Require TRINSIC_ACCESS_TOKEN is set somehow
if [ -z "$TRINSIC_ACCESS_TOKEN" ]; then
    if [ ! -f .env ] || ! grep -q "TRINSIC_ACCESS_TOKEN" .env; then
        echo "[X] TRINSIC_ACCESS_TOKEN environment variable not set or .env file not found"
        exit 0
    fi
fi

echo "[*] Building UI sample ⏳"
UI_SAMPLES_DIR="${SCRIPT_DIR}/../../../ui-web/samples"
npm --prefix "$UI_SAMPLES_DIR" --silent ci
npm --prefix "$UI_SAMPLES_DIR" --silent run build -- --logLevel=error
echo "[*] UI Sample built ✅"


echo "[*] Searching for valid python installation ⏳"
echo "[*] Targeting Python version ${TARGET_PYTHON_VERSION} 🐍"
echo "[*] Minimum Python version ${MIN_PYTHON_VERSION} 🐍"
TARGET_INTERPRETER_PATH=""
# Prefer pyenv if installed
if command -v pyenv >/dev/null 2>&1; then
    echo "[*] Pyenv detected 👍"
    # Ensure pyenv shims are active in this non-interactive script
    eval "$(pyenv init -)"

    # Ensure the target python version is available
    pyenv install -s "${TARGET_PYTHON_VERSION}"
    pyenv local "${TARGET_PYTHON_VERSION}"

    # Point to this version to activate the venv
    TARGET_INTERPRETER_PATH="$(command -v python)"
else
    # Walk $PATH to find an interpreter with the target version
    echo "[*] Walking through path ⛰️"
    IFS=:
    for d in $PATH; do
        for p in "$d"/python3 "$d"/python; do
            [ -x "$p" ] || continue
            v=$("$p" -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")' 2>/dev/null) || {
                echo "[!] Failed to find the python version of ${d:-UNKNOWN}" >&2
                continue
            }
            echo "[*] Checking $v"
            if ver_ge "$v" "$MIN_PYTHON_VERSION"; then
                TARGET_INTERPRETER_PATH="$p"
                echo "[*] Found interpreter match for version $v -> $TARGET_INTERPRETER_PATH" >&2
                break 2
            fi
        done
    done
    unset IFS
fi

if [ -z "${TARGET_INTERPRETER_PATH:-}" ]; then
    echo "[X] Could not find a valid Python interpreter. Please install pyenv (https://github.com/pyenv/pyenv) or manually install Python with a minimum version of ${MIN_PYTHON_VERSION:-3} and add it to your PATH" >&2
    exit 0
fi

echo "[*] Using Python interpreter: ${TARGET_INTERPRETER_PATH} ✅"

echo "[*] Setting up Python virtual environment in the current directory ⏳"
"${TARGET_INTERPRETER_PATH}" -m venv ${SCRIPT_DIR}/venv
echo "[*] Virtual environment enabled ✅"

echo "[*] Activating virtual environment ⏳"
. ${SCRIPT_DIR}/venv/bin/activate
echo "[*] Virtual environment activated ✅"

echo "[*] Installing Python dependencies ⏳"
PIP_DISABLE_PIP_VERSION_CHECK=1 python -m pip install -r ${SCRIPT_DIR}/requirements.txt -q
echo "[*] Dependencies installed successfully ✅"

echo "[*] Starting Python API sample server ->"
python ${SCRIPT_DIR}/main.py