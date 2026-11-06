"""Emit the shared compatibility result envelope from pytest outcomes."""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import pytest


def pytest_configure(config: pytest.Config) -> None:
    config.addinivalue_line("markers", "compatibility(id, parameters=None): SDK compatibility case metadata")
    config._compatibility_results: list[dict[str, Any]] = []  # type: ignore[attr-defined]


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item: pytest.Item, call: pytest.CallInfo[Any]):
    outcome = yield
    report = outcome.get_result()
    if report.when != "call":
        return
    marker = item.get_closest_marker("compatibility")
    if marker is None:
        return
    entry: dict[str, Any] = {"id": marker.args[0], "status": "passed" if report.passed else "skipped" if report.skipped else "failed", "durationMs": round(report.duration * 1000, 3)}
    if marker.kwargs.get("parameters"):
        entry["parameters"] = marker.kwargs["parameters"]
    if marker.kwargs.get("advisory"):
        entry["advisory"] = marker.kwargs["advisory"]
    if report.failed:
        entry["failure"] = {"name": "AssertionError", "message": str(report.longrepr)}
    if report.skipped:
        entry["skipReason"] = str(report.longrepr)
    item.config._compatibility_results.append(entry)  # type: ignore[attr-defined]


def pytest_sessionfinish(session: pytest.Session, exitstatus: int) -> None:
    path = Path(os.environ["SDK_COMPATIBILITY_RESULT_FILE"])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"schemaVersion": 1, "testCases": session.config._compatibility_results}, indent=2) + "\n")  # type: ignore[attr-defined]
