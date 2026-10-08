#!/usr/bin/env python3
"""Run C# SDK compatibility targets and write the shared result envelope."""
import json, os, shutil, subprocess, sys, tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TESTS = Path(__file__).resolve().parent

def run(args, **kwargs): return subprocess.run(args, check=True, **kwargs)
def versions(): return json.loads((ROOT / "compatibility.json").read_text())["compatibility"]["sdkVersions"]["csharp"]
def api_coverage(catalog):
    spec_path = os.getenv("SDK_COMPATIBILITY_OPENAPI_SPEC")
    if not spec_path: return None
    spec = json.loads(Path(spec_path).read_text())
    operation_cases = {}
    for case in catalog["testCases"]:
        if case.get("kind") == "api-operation" and isinstance(case.get("operationId"), str):
            operation_cases.setdefault(case["operationId"], []).append(case["id"])
    operation_ids, operations = set(), []
    for path, item in spec.get("paths", {}).items():
        if not isinstance(item, dict): continue
        for method, operation in item.items():
            if method.lower() not in {"delete", "get", "head", "options", "patch", "post", "put"} or not isinstance(operation, dict): continue
            operation_id = operation.get("operationId")
            if not isinstance(operation_id, str): continue
            operation_ids.add(operation_id)
            case_ids = operation_cases.get(operation_id, [])
            operations.append({"covered": bool(case_ids), "method": method.upper(), "operationId": operation_id, "path": path, "testCaseIds": case_ids})
    operations.sort(key=lambda operation: (operation["path"], operation["method"]))
    return {"covered": sum(operation["covered"] for operation in operations), "total": len(operations), "operations": operations, "unmappedTestCaseIds": [case["id"] for case in catalog["testCases"] if case.get("kind") == "api-operation" and case.get("operationId") not in operation_ids]}
def current_package():
    packages = list((ROOT / "api-csharp/sdk/publish").glob("Trinsic.Api.*.nupkg"))
    packages = [package for package in packages if not package.name.endswith(".snupkg")]
    if len(packages) != 1: raise RuntimeError("Expected one current C# SDK package.")
    return packages[0]
def target(target, config):
    directory = Path(tempfile.mkdtemp(prefix="trinsic-csharp-compat-")); result = {"isCurrent": target["isCurrent"], "label": target["label"], "testCases": []}
    try:
        source = directory / "runner"; shutil.copytree(TESTS, source, ignore=shutil.ignore_patterns(".results", "bin", "obj", "run_matrix.py", "run-compatibility.sh", "README.md"))
        package_source = directory / "packages"; package_source.mkdir()
        nuget_config = directory / "NuGet.Config"
        sources = ["https://api.nuget.org/v3/index.json"]
        if target["package"]:
            shutil.copy(target["package"], package_source)
            sources.insert(0, str(package_source))
            version = target["package"].name.split(".", 2)[2].removesuffix(".nupkg")
        else:
            version = target["version"]
        nuget_config.write_text("<configuration><packageSources><clear />" + "".join(
            f'<add key="source{index}" value="{value}" />' for index, value in enumerate(sources)
        ) + "</packageSources></configuration>\n")
        result["sdkVersion"] = version
        output = directory / "target-results.json"
        environment = {**os.environ, **config, "DOTNET_ROLL_FORWARD": "Major", "SDK_COMPATIBILITY_RESULT_FILE": str(output), "SDK_IS_CURRENT": str(target["isCurrent"]).lower(), "SDK_TARGET_LABEL": str(target["label"]), "SDK_VERSION": version}
        try:
            run(["dotnet", "restore", str(source / "CompatibilityRunner.csproj"), "--configfile", str(nuget_config), f"-p:TrinsicApiVersion={version}"], env=environment)
            run(["dotnet", "run", "--no-restore", "--project", str(source / "CompatibilityRunner.csproj"), f"-p:TrinsicApiVersion={version}"], env=environment)
        except subprocess.CalledProcessError as error:
            result["runnerFailure"] = f"C# target runner exited with code {error.returncode}."
        if output.exists(): result["testCases"] = json.loads(output.read_text())["testCases"]
        else: result["testCases"] = [{"id":"framework.csharp-runner", "status":"failed", "durationMs":0, "failure":{"name":"TestRunnerError", "message":result.get("runnerFailure", "C# target exited before producing structured results.")}}]
    except Exception as error: result["setupFailure"] = str(error)
    finally: shutil.rmtree(directory, ignore_errors=True)
    return result
config = {key: os.environ[key].strip() for key in ("TRINSIC_TEST_BASE_URL", "TRINSIC_TEST_ACCESS_TOKEN", "TRINSIC_TEST_VERIFICATION_PROFILE_ID")}
targets = [{"isCurrent":True,"label":"current branch","package":current_package()}]
if os.getenv("SDK_ORIGIN_MAIN_NUPKG"): targets.append({"isCurrent":True,"label":f"origin/main ({os.getenv('SDK_ORIGIN_MAIN_REVISION')})","package":Path(os.environ["SDK_ORIGIN_MAIN_NUPKG"])})
targets += [{"isCurrent":False,"label":f"Trinsic.Api@{version}","version":version,"package":None} for version in sorted(versions(), reverse=True)]
results = [target(item, config) for item in targets]
catalog = json.loads((ROOT / "compatibility-tests.json").read_text())
report = {"$schema":"https://trinsic.id/schemas/sdk-compatibility-results-v1.json", "schemaVersion":1, "run":{"generatedAt":datetime.now(timezone.utc).isoformat(),"targetBaseUrl":config["TRINSIC_TEST_BASE_URL"].rstrip("/")}, "suite":{"language":"csharp"}, "testCatalog":catalog["testCases"], "targets":results}
coverage = api_coverage(catalog)
if coverage: report["apiCoverage"] = coverage
output = Path(os.getenv("SDK_COMPATIBILITY_RESULTS_PATH", TESTS / ".results/compatibility.json")); output.parent.mkdir(parents=True, exist_ok=True); output.write_text(json.dumps(report, indent=2)+"\n")
if any("setupFailure" in item or any(case["status"] == "failed" for case in item["testCases"]) for item in results): sys.exit(1)
