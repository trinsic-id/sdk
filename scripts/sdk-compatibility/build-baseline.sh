#!/usr/bin/env bash
set -euo pipefail

# Run a detached revision's build unchanged, with its own helper, generator
# configuration, options, and post-processing. Only redirect the Swagger input.
baseline_root="$1"
language="$2"
swagger_spec="$3"
generator="$baseline_root/helpers/generate-client.sh"
original_generator="$(mktemp "$baseline_root/helpers/.compatibility-generator.XXXXXX")"
original_build=""

cp -p "$generator" "$original_generator"
cleanup() {
  mv "$original_generator" "$generator"
  if [[ -n "$original_build" ]]; then mv "$original_build" "$baseline_root/api-$language/build-sdk.sh"; fi
}
trap cleanup EXIT

cat > "$generator" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
# The original helper accepts repeated options; the last Swagger input wins.
exec bash "$SDK_COMPATIBILITY_BASELINE_GENERATOR" "$@" --swagger-file-or-url "$SDK_COMPATIBILITY_OPENAPI_SPEC"
SH

if [[ "$language" == "ruby" ]]; then
  # Older Ruby wrappers install the built gem into the user's environment.
  # Skip only that installation, preserving generation and packaging verbatim.
  original_build="$(mktemp "$baseline_root/api-ruby/.compatibility-build.XXXXXX")"
  cp -p "$baseline_root/api-ruby/build-sdk.sh" "$original_build"
  node - "$baseline_root/api-ruby/build-sdk.sh" <<'NODE'
const fs = require("node:fs");
const path = process.argv[2];
const source = fs.readFileSync(path, "utf8");
fs.writeFileSync(path, source.replace('  gem install "$gem_file" --user-install',
  '  if [[ "${SDK_COMPATIBILITY_SKIP_INSTALL:-false}" != "true" ]]; then gem install "$gem_file" --user-install; fi'));
NODE
fi

# Historical helpers resolve openapitools.json from their working directory.
cd "$baseline_root"
SDK_COMPATIBILITY_BASELINE_GENERATOR="$original_generator" \
SDK_COMPATIBILITY_OPENAPI_SPEC="$swagger_spec" SDK_COMPATIBILITY_SKIP_INSTALL=true \
  bash "$baseline_root/api-$language/build-sdk.sh"
