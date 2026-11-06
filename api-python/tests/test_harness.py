"""Offline regressions for compatibility assertions using the published SDK models."""

from datetime import date, datetime, timezone
from types import SimpleNamespace
from uuid import UUID
import json

import pytest
from trinsic_api.models.list_sessions_response import ListSessionsResponse
from trinsic_api.models.recommend_providers_response import RecommendProvidersResponse

import compatibility_support as support


@pytest.mark.parametrize(
    "actual,expected", [(True, 1), (1, True), (False, 0), (0, False)]
)
def test_scalar_rejects_boolean_number_mismatch(actual, expected):
    with pytest.raises(AssertionError, match="type mismatch"):
        support.assert_json_scalar_equivalent(actual, expected, "value")


@pytest.mark.parametrize(
    "actual,expected",
    [
        (True, True),
        (False, False),
        (1, 1.0),
        (1.0, 1),
        (None, None),
        ("value", "value"),
        (
            UUID("abcdefab-1234-1234-1234-123456789012"),
            "ABCDEFAB-1234-1234-1234-123456789012",
        ),
        (date(2026, 1, 2), "2026-01-02"),
        (datetime(2026, 1, 2, tzinfo=timezone.utc), "2026-01-02T01:00:00+01:00"),
    ],
)
def test_scalar_preserves_supported_equivalences(actual, expected):
    support.assert_json_scalar_equivalent(actual, expected, "value")


def check_response(response):
    raw = json.loads(response.raw_data)
    support.assert_equivalent(
        support.model_fields(response.data, raw, decoded=True),
        support.model_fields(response.data, raw),
        "response",
        True,
    )
    return response.data


def envelope(model, raw):
    return SimpleNamespace(status_code=200, data=model, raw_data=json.dumps(raw))


SESSION = {
    "id": "test-session",
    "done": False,
    "success": False,
    "created": 1,
    "updated": 1,
}


@pytest.mark.parametrize("sessions", [[], [SESSION]])
def test_list_wire_comparison_accepts_empty_and_nonempty_pages(sessions):
    raw = {"sessions": sessions, "total": len(sessions), "more": False}
    response = envelope(ListSessionsResponse.from_dict(raw), raw)
    assert check_response(response) is response.data


@pytest.mark.parametrize("mutation", ["truncate", "id", "total", "more"])
def test_list_wire_comparison_rejects_dropped_entries_and_changed_fields(mutation):
    raw = {"sessions": [SESSION], "total": 1, "more": False}
    model = ListSessionsResponse.from_dict(raw)
    if mutation == "truncate":
        model.sessions.clear()
    elif mutation == "id":
        model.sessions[0].id = "different"
    elif mutation == "total":
        model.total = 2
    else:
        model.more = True
    with pytest.raises(AssertionError):
        check_response(envelope(model, raw))


PROVIDER = {
    "id": "provider",
    "name": "Provider",
    "logoUrl": "https://example.com/logo",
    "subtext": "Description",
    "health": "Healthy",
    "regions": [],
    "countries": ["US"],
    "subdivisions": [],
    "subProviders": [
        {
            "id": "sub",
            "name": "Sub",
            "subtext": "Description",
            "logoUrl": "https://example.com/sub",
        }
    ],
}


@pytest.mark.parametrize("mutation", [None, "provider", "country", "subprovider"])
def test_recommendations_compare_supported_nested_fields(mutation):
    raw = {"recommendedProviders": [PROVIDER], "remainder": []}
    model = RecommendProvidersResponse.from_dict(raw)
    if mutation == "provider":
        model.recommended_providers.clear()
    elif mutation == "country":
        model.recommended_providers[0].countries.clear()
    elif mutation == "subprovider":
        model.recommended_providers[0].sub_providers[0].name = "Changed"
    if mutation:
        with pytest.raises(AssertionError):
            check_response(envelope(model, raw))
    else:
        check_response(envelope(model, raw))


def test_wire_comparison_preserves_boolean_number_distinction():
    with pytest.raises(AssertionError, match="type mismatch"):
        support.assert_equivalent({"value": True}, {"value": 1}, "response", True)


def test_published_sdk_response_envelope_against_local_http_server():
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
    from threading import Thread

    raw = {"sessions": [SESSION], "total": 1, "more": False, "futureField": "ignored"}

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(raw).encode())

        def log_message(self, *_args):
            pass

    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        configuration = support.Configuration(
            host=f"http://127.0.0.1:{server.server_port}"
        )
        with support.CapturingClient(configuration) as client:
            response = support.SessionsApi(client).list_sessions_with_http_info(
                str(support.PROFILE_ID)
            )
            result = check_response(response)
            assert result.sessions[0].id == SESSION["id"]
            assert result.total == 1
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
