#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Additional properties for C# client generation
additionalProperties="packageName=Trinsic.Api,packageVersion=[VERSION],nullableReferenceTypes=true,modelPropertySorting=alphabetical,library=generichost,useDateTimeOffset=true,validatable=false,disallowAdditionalPropertiesIfNotPresent=false,licenseId=MIT,apiName=TrinsicApi,targetFramework=net8.0"

# Generate the C# client
"$SCRIPT_DIR/../helpers/generate-client.sh" \
    -l "csharp" \
    -o "$SCRIPT_DIR/sdk" \
    -a "$additionalProperties"

if [ $? -ne 0 ]; then
    handle_error "Failed to generate C# client"
fi

# Function to normalize lines by removing all whitespace
normalize_line() {
    echo "$1" | tr -d '[:space:]'
}

# Function to apply hotfixes to C# files
apply_hotfix() {
    local target_line="$1"
    local replacement_line="$2"
    local root_path="${3:-$SCRIPT_DIR/sdk}"
    
    local normalized_target=$(normalize_line "$target_line")
    
    echo "Applying hotfix for $target_line ($normalized_target) to $replacement_line in $root_path"
    
    find "$root_path" -name "*.cs" -type f | while read -r file_path; do
        local modified=false
        local temp_file=$(mktemp)
        
        while IFS= read -r line; do
            local normalized_line=$(normalize_line "$line")
            if [ "$normalized_line" = "$normalized_target" ]; then
                echo "MATCH FOUND in $file_path"
                echo "$normalized_line"
                echo "$replacement_line" >> "$temp_file"
                modified=true
            else
                echo "$line" >> "$temp_file"
            fi
        done < "$file_path"
        
        if [ "$modified" = true ]; then
            mv "$temp_file" "$file_path"
            echo "Updated: $file_path"
        else
            rm "$temp_file"
        fi
    done
}

# Apply all hotfixes
apply_hotfix 'if (DateOnly.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out DateOnly result))' '                if (DateOnly.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly result))'

apply_hotfix 'public interface IAttachmentsApi : IApi' '    public partial interface IAttachmentsApi : IApi'

apply_hotfix 'public interface ISessionsApi : IApi' '    public partial interface ISessionsApi : IApi'

apply_hotfix 'public interface INetworkApi : IApi' '    public partial interface INetworkApi : IApi'

apply_hotfix 'services.AddSingleton(typeof(RateLimitProvider<>).MakeGenericType(tokenType));' '                    services.AddTransient(typeof(ConstantTokenProvider<>).MakeGenericType(tokenType));'

apply_hotfix 'services.AddSingleton(typeof(TokenProvider<>).MakeGenericType(tokenType),' '                    services.AddTransient(typeof(TokenProvider<>).MakeGenericType(tokenType),'

apply_hotfix 's => s.GetRequiredService(typeof(RateLimitProvider<>).MakeGenericType(tokenType)));' '                        s => s.GetRequiredService(typeof(ConstantTokenProvider<>).MakeGenericType(tokenType)));'

# Copy Additional folder
additionalFolder="$SCRIPT_DIR/Additional"
echo "Copying $additionalFolder to $SCRIPT_DIR/sdk/src/Trinsic.Api/Additional"
destinationFolder="$SCRIPT_DIR/sdk/src/Trinsic.Api/Additional"

if [ -d "$destinationFolder" ]; then
    rm -rf "$destinationFolder"
fi

cp -r "$additionalFolder" "$destinationFolder"

# Modify .csproj file
csprojPath="$SCRIPT_DIR/sdk/src/Trinsic.Api/Trinsic.Api.csproj"

if command -v xmlstarlet >/dev/null 2>&1; then
    # Use xmlstarlet for XML manipulation if available
    xmlstarlet ed -L \
        -u "//PropertyGroup/Authors" -v "Trinsic" \
        -u "//PropertyGroup/Company" -v "Trinsic" \
        -u "//PropertyGroup/AssemblyTitle" -v "Trinsic API C# Library" \
        "$csprojPath"
else
    # Fallback to sed-based XML modification
    sed -i 's|<Authors>.*</Authors>|<Authors>Trinsic</Authors>|' "$csprojPath"
    sed -i 's|<Company>.*</Company>|<Company>Trinsic</Company>|' "$csprojPath"
    sed -i 's|<AssemblyTitle>.*</AssemblyTitle>|<AssemblyTitle>Trinsic API C# Library</AssemblyTitle>|' "$csprojPath"
fi