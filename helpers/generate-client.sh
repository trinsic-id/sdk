#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

language=""
version_name=""
swagger_file_or_url="https://api.trinsic.id/swagger/api/swagger.json"
output_folder=""
additional_properties=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --language|-language)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      language="$2"
      ;;
    --version-name|-versionName)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      version_name="$2"
      ;;
    --swagger-file-or-url|-swaggerFileOrUrl)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      swagger_file_or_url="$2"
      ;;
    --output-folder|-outputFolder)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      output_folder="$2"
      ;;
    --additional-property|--additional-properties|-additionalProperty|-additionalProperties)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      additional_properties+=("$2")
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
  shift 2
done

if [[ -z "$language" ]]; then
  echo "--language is required" >&2
  exit 1
fi

if [[ -z "$version_name" ]]; then
  version_name="$language"
fi

if [[ -z "$output_folder" ]]; then
  echo "--output-folder is required" >&2
  exit 1
fi

template_args=()
# Verify the pinned artifact and every upstream template before deleting any
# existing SDK output. Render overrides from the reviewed patches for this run.
template_workspace="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-templates.XXXXXX")"
trap 'rm -rf "$template_workspace"' EXIT
generator_jar="$(node "$SCRIPT_DIR/template-overrides.mjs" prepare --output "$template_workspace")"
if [[ -d "$template_workspace/$language" ]]; then
  template_args+=(--template-dir "$template_workspace/$language")
fi

if [[ "${swagger_file_or_url}" == https://* ]]; then
  echo "Downloading specification from $swagger_file_or_url"
  local_swagger_file_path="$SCRIPT_DIR/swagger.json"
  curl -fsSL "$swagger_file_or_url" -o "$local_swagger_file_path"
  echo "Downloaded specification from $swagger_file_or_url to $local_swagger_file_path"
else
  if [[ ! -f "$swagger_file_or_url" ]]; then
    echo "The swagger file '$swagger_file_or_url' does not exist." >&2
    exit 1
  fi
  local_swagger_file_path="$swagger_file_or_url"
fi

if [[ -d "$output_folder" ]]; then
  echo "Cleaning up output folder $output_folder"
  rm -rf "$output_folder"
fi
mkdir -p "$output_folder/publish"

version="$(get_version "$version_name")"
resolved_properties=()
for property in "${additional_properties[@]}"; do
  resolved_properties+=("${property//\[VERSION\]/$version}")
done

concatenated_additional_properties=""
if [[ ${#resolved_properties[@]} -gt 0 ]]; then
  concatenated_additional_properties="$(IFS=,; printf '%s' "${resolved_properties[*]}")"
fi

echo "Generating $language SDK from $local_swagger_file_path in $output_folder with additional properties: $concatenated_additional_properties"
# Invoke the exact JAR selected by the root configuration and verified above.
java -jar "$generator_jar" generate \
  -i "$local_swagger_file_path" \
  -g "$language" \
  -o "$output_folder" \
  ${template_args[@]+"${template_args[@]}"} \
  --additional-properties="$concatenated_additional_properties" >/dev/null

node "$SCRIPT_DIR/inject-sdk-header.mjs" "$language" "$version" "$output_folder"

echo "Generated $language SDK $output_folder"
