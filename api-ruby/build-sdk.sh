#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
swagger_file_or_url=""
output_folder="$SCRIPT_DIR/sdk"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --swagger-file-or-url) swagger_file_or_url="$2"; shift 2 ;;
    --output-folder) output_folder="$2"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done
generator_args=()
[[ -z "$swagger_file_or_url" ]] || generator_args+=(--swagger-file-or-url "$swagger_file_or_url")

"$REPO_ROOT/helpers/generate-client.sh" \
  --language ruby \
  --output-folder "$output_folder" \
  "${generator_args[@]}" \
  --additional-property "gemAuthor=Trinsic" \
  --additional-property "gemAuthorEmail=support@trinsic.id" \
  --additional-property "gemDescription='Trinsic Api SDK to assist you in integrating with Trinsic'" \
  --additional-property "gemHomepage=https://trinsic.id" \
  --additional-property "gemName=trinsic_api" \
  --additional-property "gemSummary='Trinsic Api SDK'" \
  --additional-property "gemVersion=[VERSION]" \
  --additional-property "moduleName=TrinsicApi"

cp "$REPO_ROOT/LICENSE" "$output_folder/"
cp "$SCRIPT_DIR/README.md" "$output_folder/"

spec_file="$output_folder/trinsic_api.gemspec"
node - "$spec_file" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
const index = lines.findIndex((line) => /^\s*Gem::Specification/.test(line));
if (index >= 0) {
  fs.writeFileSync(file, `${lines.slice(0, index).join("\n")}\n`);
}
NODE

cat >> "$spec_file" <<'RUBYSPEC'
Gem::Specification.new do |s|
  s.name        = "trinsic_api"
  s.version     = TrinsicApi::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Trinsic"]
  s.email       = ["support@trinsic.id"]
  s.homepage    = "https://trinsic.id"
  s.summary     = "Trinsic API Ruby Library"
  s.description = "This library is an SDK to interact with Trinsic's APIs."
  s.license     = "MIT"
  s.required_ruby_version = ">= 2.7"
  s.metadata    = {}

  s.add_runtime_dependency 'typhoeus', '~> 1.0', '>= 1.0.1'

  s.add_development_dependency 'rspec', '~> 3.6', '>= 3.6.0'

  s.files         = `find *`.split("\n").uniq.sort.select { |f| !f.empty? }
  s.test_files    = `find spec/*`.split("\n")
  s.executables   = []
  s.require_paths = ["lib"]
end
RUBYSPEC

(
  cd "$output_folder"
  gem build trinsic_api.gemspec
  mv ./*.gem "$output_folder/publish"/
)

shopt -s nullglob
gem_files=("$output_folder"/publish/*.gem)
if [[ ${#gem_files[@]} -eq 0 ]]; then
  echo "No gem files found in $output_folder/publish" >&2
  exit 1
fi
for gem_file in "${gem_files[@]}"; do
  [[ "${SDK_COMPATIBILITY_SKIP_INSTALL:-false}" == "true" ]] && continue
  echo "Installing $gem_file"
  gem install "$gem_file" --user-install
done
