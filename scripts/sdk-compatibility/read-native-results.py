"""Read native test reports, including tests without compatibility IDs."""
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET


kind, source = sys.argv[1:]
if kind == "go":
    events = [json.loads(line) for line in Path(source).read_text().splitlines() if line.strip()]
    if not any(not event.get("Test") and event.get("Action") in ("pass", "fail") for event in events):
        raise ValueError("Go did not finish its native report")
    failures = [{"name": event["Test"], "message": "".join(output.get("Output", "") for output in events if output.get("Test") == event["Test"])}
                for event in events if event.get("Test") and event.get("Action") == "fail"]
    failures.extend({"name": "native-panic", "message": event["Output"]} for event in events if event.get("Output", "").startswith("panic:"))
    print(json.dumps(failures))
    sys.exit(0)

paths = [Path(source)] if Path(source).is_file() else sorted(Path(source).glob("TEST-*.xml"))
if not paths:
    raise ValueError("Native test runner did not produce a report")
failures = []
for path in paths:
    root = ET.parse(path).getroot()
    # TRX has a default namespace; Surefire does not.
    for element in root.iter():
        element.tag = element.tag.rsplit("}", 1)[-1]
    if kind == "trx":
        if not root.findall("./Results/UnitTestResult"):
            raise ValueError("TRX report contains no test results")
        names = {
            test.attrib["id"]: method.attrib["className"] + "." + method.attrib["name"]
            for test in root.findall("./TestDefinitions/UnitTest")
            if (method := test.find("TestMethod")) is not None
        }
        failed_names = []
        for result in root.findall("./Results/UnitTestResult"):
            if result.attrib["outcome"] not in ("Passed", "NotExecuted"):
                failed_names.append(result.attrib["testName"])
                failures.append({"name": names.get(result.attrib["testId"], result.attrib["testName"]),
                                 "message": result.findtext("./Output/ErrorInfo/Message", result.attrib["outcome"])})
        for info in root.findall("./ResultSummary/RunInfos/RunInfo"):
            if info.attrib.get("outcome") in ("Error", "Failed", "Aborted"):
                message = info.findtext("Text", "Native runner error")
                # The xUnit adapter also logs each failed test as a run-level
                # error. Its UnitTestResult above is the authoritative outcome.
                if not (message.rstrip().endswith("[FAIL]") and any(name in message for name in failed_names)):
                    failures.append({"name": "native-runner", "message": message})
        summary = root.find("ResultSummary")
        if summary is not None and summary.attrib.get("outcome") in ("Error", "Aborted"):
            failures.append({"name": "native-runner", "message": "Native run " + summary.attrib["outcome"]})
    else:
        if not list(root.iter("testcase")):
            raise ValueError("JUnit report contains no test results")
        for case in root.iter("testcase"):
            for error in list(case.findall("failure")) + list(case.findall("error")):
                failures.append({"name": case.attrib["name"] if kind == "node" else case.attrib["classname"] + "." + case.attrib["name"],
                                 "message": error.attrib.get("message") or error.text or "Native test failed"})
print(json.dumps(failures))
