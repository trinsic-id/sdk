#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Additional properties for Ruby client generation
additionalProperties="gemAuthor=Trinsic,gemAuthorEmail=support@trinsic.id,gemDescription='Trinsic Api SDK to assist you in integrating with Trinsic',gemHomepage=https://trinsic.id,gemName=trinsic_api,gemSummary='Trinsic Api SDK',gemVersion=[VERSION],moduleName=TrinsicApi"

# Generate the Ruby client
"$SCRIPT_DIR/../helpers/generate-client.sh" \
    -l "ruby" \
    -o "$SCRIPT_DIR/sdk" \
    -a "$additionalProperties"

if [ $? -ne 0 ]; then
    handle_error "Failed to generate Ruby client"
fi

# Copy additional files
cp "$SCRIPT_DIR/../LICENSE" "$SCRIPT_DIR/sdk/"
cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk/"

pushd "$SCRIPT_DIR/sdk" > /dev/null

# Modify gemspec file - remove content starting from 'Gem::Specification' line
specFile="$SCRIPT_DIR/sdk/trinsic_api.gemspec"
if [ -f "$specFile" ]; then
    # Find the line number where 'Gem::Specification' starts and keep everything before it
    lineNum=$(grep -n '^\s*Gem::Specification' "$specFile" | cut -d: -f1 | head -1)
    if [ -n "$lineNum" ]; then
        # Keep everything before the Gem::Specification line
        head -n $((lineNum - 1)) "$specFile" > "${specFile}.tmp"
        mv "${specFile}.tmp" "$specFile"
    fi
    
    # Append the new gemspec content
    cat >> "$specFile" << 'EOF'
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
EOF
fi

# Build the gem
gem build trinsic_api.gemspec
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "gem build failed"
fi

# Move gem file to publish directory
if [ ! -d "$SCRIPT_DIR/sdk/publish" ]; then
    mkdir -p "$SCRIPT_DIR/sdk/publish"
fi

mv *.gem "$SCRIPT_DIR/sdk/publish/"

# Install the gem
gemFile=$(find "$SCRIPT_DIR/sdk/publish" -name "*.gem" | head -1)
if [ -n "$gemFile" ]; then
    echo "Installing $gemFile"
    gem install "$gemFile" --user-install
    if [ $? -ne 0 ]; then
        popd > /dev/null
        handle_error "gem install failed"
    fi
fi

popd > /dev/null
