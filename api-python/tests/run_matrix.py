#!/usr/bin/env python3
"""Run Python SDK compatibility targets and write the shared result envelope."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TESTS = Path(__file__).resolve().parent


def command(arguments: list[str], *, cwd: Path | None = None, environment: dict[str, str] | None = None) -> None:
    subprocess.run(arguments, cwd=cwd, env=environment, check=True)


def version_key(version: str) -> tuple[int, ...]:
    return tuple(int(part) for part in version.split(".")[:3])


def read_json(path: Path) -> object:
    with path.open() as stream:
        return json.load(stream)


def api_coverage(catalog: dict[str, object]) -> dict[str, object] | None:
    spec_path = os.environ.get("SDK_COMPATIBILITY_OPENAPI_SPEC")
    if not spec_path:
        return None
    spec = read_json(Path(spec_path))
    if not isinstance(spec, dict) or not isinstance(spec.get("paths"), dict):
        raise RuntimeError(f"OpenAPI specification at {spec_path} has no paths object.")
    operation_cases: dict[str, list[str]] = {}
    for case in catalog["testCases"]:
        if case.get("kind") == "api-operation" and isinstance(case.get("operationId"), str):
            operation_cases.setdefault(case["operationId"], []).append(case["id"])
    operation_ids: set[str] = set()
    operations: list[dict[str, object]] = []
    for path, item in spec["paths"].items():
        if not isinstance(item, dict):
            continue
        for method, operation in item.items():
            if method.lower() not in {"delete", "get", "head", "options", "patch", "post", "put"} or not isinstance(operation, dict):
                continue
            operation_id = operation.get("operationId")
            if not isinstance(operation_id, str):
                continue
            operation_ids.add(operation_id)
            test_case_ids = operation_cases.get(operation_id, [])
            operations.append({"covered": bool(test_case_ids), "method": method.upper(), "operationId": operation_id, "path": path, "testCaseIds": test_case_ids})
    operations.sort(key=lambda value: (value["path"], value["method"]))
    return {
        "covered": sum(1 for operation in operations if operation["covered"]),
        "total": len(operations),
        "operations": operations,
        "unmappedTestCaseIds": [case["id"] for case in catalog["testCases"] if case.get("kind") == "api-operation" and case.get("operationId") not in operation_ids],
    }


def current_wheel() -> Path:
    wheels = sorted((ROOT / "api-python" / "sdk" / "publish").glob("trinsic_api-*.whl"))
    if len(wheels) != 1:
        raise RuntimeError("Expected exactly one current Python SDK wheel; run api-python/build-sdk.sh first.")
    return wheels[0]


def run_target(target: dict[str, object], configuration: dict[str, str]) -> dict[str, object]:
    install_root = Path(tempfile.mkdtemp(prefix="trinsic-python-compat-"))
    result: dict[str, object] = {"isCurrent": target["isCurrent"], "label": target["label"], "testCases": []}
    try:
        try:
            command([sys.executable, "-m", "venv", str(install_root)])
            python = install_root / "bin" / "python"
            command([str(python), "-m", "pip", "install", "--disable-pip-version-check", "--quiet", str(target["packageSpecifier"])])
            version = subprocess.check_output([str(python), "-c", "from importlib.metadata import version; print(version('trinsic-api'))"], text=True).strip()
        except subprocess.CalledProcessError as error:
            result["setupFailure"] = f"Setup command exited with code {error.returncode}."
            return result
        result["sdkVersion"] = version
        print(f"\n=== Testing {target['label']} (resolved {version}) ===", flush=True)
        target_result = install_root / "target-results.json"
        environment = {**os.environ, **configuration, "SDK_COMPATIBILITY_RESULT_FILE": str(target_result), "SDK_IS_CURRENT": str(target["isCurrent"]).lower(), "SDK_TARGET_LABEL": str(target["label"]), "SDK_VERSION": version}
        try:
            command([str(python), str(TESTS / "run_target.py")], environment=environment)
        except subprocess.CalledProcessError as error:
            print(f"{target['label']}: test runner exited with code {error.returncode}.", file=sys.stderr)
        if target_result.exists():
            parsed = read_json(target_result)
            if isinstance(parsed, dict) and parsed.get("schemaVersion") == 1 and isinstance(parsed.get("testCases"), list):
                result["testCases"] = parsed["testCases"]
                return result
        result["testCases"] = [{"durationMs": 0, "failure": {"name": "TestRunnerError", "message": "Python target exited before producing structured results."}, "id": "framework.python-runner", "status": "failed"}]
        return result
    finally:
        shutil.rmtree(install_root, ignore_errors=True)


def main() -> None:
    configuration = {name: os.environ[name].strip() for name in ("TRINSIC_TEST_BASE_URL", "TRINSIC_TEST_ACCESS_TOKEN", "TRINSIC_TEST_VERIFICATION_PROFILE_ID")}
    matrix = read_json(ROOT / "compatibility.json")
    versions = matrix["compatibility"]["sdkVersions"].get("python")
    if not isinstance(versions, list) or not all(isinstance(version, str) for version in versions):
        raise RuntimeError("Compatibility matrix does not define Python SDK versions.")
    targets: list[dict[str, object]] = [{"isCurrent": True, "label": "current branch", "packageSpecifier": str(current_wheel())}]
    main_wheel = os.environ.get("SDK_ORIGIN_MAIN_WHEEL")
    if main_wheel:
        revision = os.environ.get("SDK_ORIGIN_MAIN_REVISION")
        targets.append({"isCurrent": True, "label": f"origin/main ({revision})" if revision else "origin/main", "packageSpecifier": main_wheel})
    targets.extend({"isCurrent": False, "label": f"trinsic-api@{version}", "packageSpecifier": f"trinsic-api=={version}"} for version in sorted(versions, key=version_key, reverse=True))
    catalog = read_json(ROOT / "compatibility-tests.json")
    results = [run_target(target, configuration) for target in targets]
    expected = [case["id"] for case in catalog["testCases"] if "python" in case["requiredLanguages"]]
    for target in results:
        actual = {case["id"] for case in target["testCases"]}
        missing = [identifier for identifier in expected if identifier not in actual]
        if missing:
            target["testCases"].append({"durationMs": 0, "failure": {"name": "CoverageError", "message": f"Missing required Python test cases: {', '.join(missing)}."}, "id": "framework.catalog-coverage", "status": "failed"})
    report = {"$schema": "https://trinsic.id/schemas/sdk-compatibility-results-v1.json", "schemaVersion": 1, "run": {"generatedAt": datetime.now(timezone.utc).isoformat(), "targetBaseUrl": configuration["TRINSIC_TEST_BASE_URL"].rstrip("/")}, "suite": {"language": "python"}, "testCatalog": catalog["testCases"], "targets": results}
    coverage = api_coverage(catalog)
    if coverage:
        report["apiCoverage"] = coverage
    output = Path(os.environ.get("SDK_COMPATIBILITY_RESULTS_PATH", TESTS / ".results" / "compatibility.json"))
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + "\n")
    print(f"\nStructured compatibility results: {output}")
    if any("setupFailure" in target or any(case["status"] == "failed" for case in target["testCases"]) for target in results):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
