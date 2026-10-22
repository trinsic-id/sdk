#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
JAVA_21_HOME="${SDK_COMPATIBILITY_JAVA_HOME:-/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home}"
[[ -x "$JAVA_21_HOME/bin/java" ]] || { echo "JDK 21 was not found at $JAVA_21_HOME. Set SDK_COMPATIBILITY_JAVA_HOME to a JDK 21 home." >&2; exit 1; }
[[ "$("$JAVA_21_HOME/bin/java" -version 2>&1 | head -n1)" == *'"21.'* ]] || { echo "SDK_COMPATIBILITY_JAVA_HOME must select JDK 21: $JAVA_21_HOME" >&2; exit 1; }
command -v mvn >/dev/null || { echo "Maven is required to run Java compatibility tests." >&2; exit 1; }
command -v curl >/dev/null || { echo "curl is required to fetch Java compatibility inputs." >&2; exit 1; }
export JAVA_HOME="$JAVA_21_HOME" PATH="$JAVA_21_HOME/bin:$PATH"
for key in TRINSIC_TEST_BASE_URL TRINSIC_TEST_ACCESS_TOKEN TRINSIC_TEST_VERIFICATION_PROFILE_ID; do [[ -n "${!key:-}" ]] || { echo "$key is required" >&2; exit 1; }; done
swagger="$(mktemp "${TMPDIR:-/tmp}/trinsic-java-swagger.XXXXXX")"; current="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-java-current.XXXXXX")"; main="$(mktemp -d "${TMPDIR:-/tmp}/trinsic-java-main.XXXXXX")"
cleanup(){ git -C "$REPO_ROOT" worktree remove --force "$main" 2>/dev/null || true; rm -rf "$current"; rm -f "$swagger"; }; trap cleanup EXIT
curl -fsS "${TRINSIC_TEST_BASE_URL%/}/swagger/api/swagger.json" -o "$swagger"
bash "$REPO_ROOT/api-java/build-sdk.sh" --swagger-file-or-url "$swagger" --output-folder "$current"
[[ -x "$current/gradlew" ]] || { echo "Generated current Java SDK did not include a Gradle wrapper." >&2; exit 1; }
rmdir "$main"; git -C "$REPO_ROOT" worktree add --detach "$main" "${SDK_COMPATIBILITY_MAIN_REF:-origin/main}" >/dev/null; cp "$REPO_ROOT/api-java/build-sdk.sh" "$main/api-java/build-sdk.sh"; JAVA_HOME="$JAVA_HOME" bash "$main/api-java/build-sdk.sh" --swagger-file-or-url "$swagger" --output-folder "$main/api-java/sdk-build"
[[ -x "$main/api-java/sdk-build/gradlew" ]] || { echo "Generated mainline Java SDK did not include a Gradle wrapper." >&2; exit 1; }
for version in 3.2.1 3.1.0 3.0.0; do curl -fsS --max-time 5 -o /dev/null "https://jitpack.io/com/github/trinsic-id/sdk-java-api/$version/sdk-java-api-$version.pom" || { echo "Published Java SDK artifact com.github.trinsic-id:sdk-java-api:$version could not be resolved from JitPack." >&2; exit 1; }; done
SDK_COMPATIBILITY_CURRENT_PACKAGE="$current" SDK_COMPATIBILITY_MAIN_PACKAGE="$main/api-java/sdk-build" SDK_ORIGIN_MAIN_REVISION="$(git -C "$main" rev-parse --short HEAD)" SDK_COMPATIBILITY_OPENAPI_SPEC="$swagger" SDK_COMPATIBILITY_PACKAGE_LABEL="com.github.trinsic-id:sdk-java-api" SDK_COMPATIBILITY_VALIDATE_CATALOG=true node "$REPO_ROOT/scripts/sdk-compatibility/run-matrix.mjs" java node "$SCRIPT_DIR/run_matrix.mjs"
