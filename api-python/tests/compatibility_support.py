"""SDK setup, redirect flow, and JSON comparisons shared by the pytest cases."""

from __future__ import annotations

import os
import base64
import json
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime
from typing import Any
from uuid import UUID
from pydantic import BaseModel

from trinsic_api.api_client import ApiClient
from trinsic_api.configuration import Configuration
from trinsic_api.api.providers_api import ProvidersApi
from trinsic_api.api.redirect_uris_api import RedirectUrisApi
from trinsic_api.api.sessions_api import SessionsApi
from trinsic_api.api.verification_profiles_api import VerificationProfilesApi
from trinsic_api.models.create_direct_provider_session_request import CreateDirectProviderSessionRequest
from trinsic_api.models.create_hosted_provider_session_request import CreateHostedProviderSessionRequest
from trinsic_api.models.get_attachment_request import GetAttachmentRequest
from trinsic_api.models.get_session_result_request import GetSessionResultRequest
from trinsic_api.models.integration_capability import IntegrationCapability
from trinsic_api.models.recommend_providers_request import RecommendProvidersRequest

BASE_URL = os.environ["TRINSIC_TEST_BASE_URL"].rstrip("/")
TOKEN = os.environ["TRINSIC_TEST_ACCESS_TOKEN"]
PROFILE_ID = UUID(os.environ["TRINSIC_TEST_VERIFICATION_PROFILE_ID"])
TARGET = os.environ["SDK_TARGET_LABEL"]
TEST_PROVIDER = "trinsic-test-redirect"


def client() -> ApiClient:
    configuration = Configuration(host=BASE_URL)
    configuration.access_token = TOKEN
    return CapturingClient(configuration)


class CapturingClient(ApiClient):
    """Observe the real SDK transport; retain the response used by its decoder."""
    last_response = None

    def call_api(self, method, url, header_params=None, body=None, *args, **kwargs):
        self.last_request = (method, url, body)
        response = super().call_api(method, url, header_params, body, *args, **kwargs)
        self.last_response = json.loads(response.read()) if response.read() else None
        return response

    def response_deserialize(self, response_data, response_types_map):
        response = super().response_deserialize(response_data, response_types_map)
        if response.data is not None and self.last_response is not None:
            assert_equivalent(model_fields(response.data, self.last_response, decoded=True),
                              model_fields(response.data, self.last_response), "response", True)
        return response


def assert_request(api, *, body=None, query=None):
    method, url, sent = api.api_client.last_request
    if body is not None:
        assert method == "POST"
        assert isinstance(sent, dict)
        for key, value in body.items(): assert_equivalent(sent[key], value, f"request.{key}", True)
    if query is not None:
        parsed = dict(urllib.parse.parse_qsl(urllib.parse.urlparse(url).query))
        for key, value in query.items(): assert parsed[key] == str(value)


def model_fields(model, wire, decoded=False, omit_optional_nulls=False):
    """Project wire keys using the installed model, including nested dictionaries."""
    if isinstance(model, BaseModel) and isinstance(wire, dict):
        return {field.alias or name: model_fields(getattr(model, name), wire[field.alias or name], decoded, omit_optional_nulls)
                for name, field in type(model).model_fields.items() if (field.alias or name) in wire
                and (not omit_optional_nulls or field.is_required() or wire[field.alias or name] is not None)}
    if isinstance(wire, list):
        if decoded and (not isinstance(model, list) or len(model) != len(wire)):
            raise AssertionError("SDK changed array shape")
        return [model_fields(model[index] if isinstance(model, list) and index < len(model) else None, item, decoded, omit_optional_nulls)
                for index, item in enumerate(wire)]
    if isinstance(wire, dict) and isinstance(model, dict):
        if decoded: assert set(model) == set(wire), "SDK changed dictionary keys"
        return {key: model_fields(model.get(key), item, decoded, omit_optional_nulls) for key, item in wire.items()}
    return model if decoded else wire


def assert_session(response, session_id, done, success):
    assert_session_id(response, session_id)
    assert response.session.done is done
    assert response.session.success is success


def assert_attachment(response):
    assert response.content_type == "image/png"
    assert base64.b64decode(response.content, validate=True).startswith(b"\x89PNG\r\n\x1a\n"), "Attachment must contain PNG bytes"


def assert_page(response, field):
    assert isinstance(getattr(response, field), list)
    assert isinstance(response.more, bool)
    for item in getattr(response, field):
        assert item.id


def assert_recommendations(response):
    assert response.recommended_providers or response.remainder
    for provider in [*response.recommended_providers, *response.remainder]:
        for field in ("id", "name", "logo_url", "subtext", "health"):
            assert isinstance(getattr(provider, field), str)
        for field in ("regions", "countries", "subdivisions"):
            assert isinstance(getattr(provider, field), list)
            assert all(isinstance(item, str) for item in getattr(provider, field))


def value(model: Any, field: str) -> Any:
    return getattr(model, field)


def normalized_uuid(candidate: Any) -> str:
    return str(candidate).lower()


def redirect_url(api: RedirectUrisApi) -> str:
    page = 1
    while True:
        response = api.list(page=page, page_size=100)
        candidates = []
        for item in response.uris:
            uri = getattr(item, "uri", None)
            if not isinstance(uri, str):
                continue
            parsed = urllib.parse.urlparse(uri)
            if parsed.scheme in {"http", "https"} and parsed.netloc:
                candidates.append(uri)
        preferred = next((uri for uri in candidates if urllib.parse.urlparse(uri).scheme == "https" and urllib.parse.urlparse(uri).netloc == "example.com"), None)
        if preferred:
            return preferred
        if candidates:
            return candidates[0]
        if not response.more:
            break
        page += 1
    raise AssertionError("The test environment must have at least one registered HTTP(S) redirect URI.")


CREATED_SESSIONS = []


def direct_session(api: SessionsApi, redirects: RedirectUrisApi):
    arguments = {
        "provider": TEST_PROVIDER,
        "verification_profile_id": str(PROFILE_ID),
        "redirect_url": redirect_url(redirects),
        "capabilities": [IntegrationCapability.LAUNCHBROWSER, IntegrationCapability.CAPTUREREDIRECT],
        "fallback_to_hosted_ui": False,
    }
    request = CreateDirectProviderSessionRequest(
        **arguments,
    )
    response = api.create_direct_provider_session(request)
    CREATED_SESSIONS.append((api, response.session_id))
    assert_request(api, body={"provider": TEST_PROVIDER, "verificationProfileId": str(PROFILE_ID),
                             "capabilities": ["LaunchBrowser", "CaptureRedirect"], "fallbackToHostedUI": False})
    assert response.session_id
    UUID(str(response.session_id))
    assert response.next_step.method == "LaunchBrowser"
    assert response.result_collection.method == "CaptureRedirect"
    assert response.result_collection.results_access_key
    assert response.next_step.content
    assert urllib.parse.urlparse(response.next_step.content).scheme in {"http", "https"}
    return response


class BrowserSession:
    def __init__(self) -> None:
        self.cookies = ""

    def fetch(self, url: str) -> tuple[int, str | None, str]:
        request = urllib.request.Request(url, headers={"Cookie": self.cookies} if self.cookies else {})
        opener = urllib.request.build_opener(NoRedirect())
        try:
            response = opener.open(request)  # noqa: S310 -- redirect comes from the configured test provider
        except urllib.error.HTTPError as error:
            response = error
        cookies = response.headers.get_all("Set-Cookie", [])
        if cookies:
            self.cookies = "; ".join(cookie.split(";", 1)[0] for cookie in cookies)
        return response.status, response.headers.get("Location"), url


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):  # noqa: D401
        return None


def completed_session(api: SessionsApi, redirects: RedirectUrisApi) -> tuple[Any, str, str]:
    session = direct_session(api, redirects)
    browser = BrowserSession()
    status, location, launch_url = browser.fetch(session.next_step.content)
    assert status == 302 and location
    integration = urllib.parse.urljoin(launch_url, location)
    callback = urllib.parse.urlparse(dict(urllib.parse.parse_qsl(urllib.parse.urlparse(integration).query))["redirectUrl"])
    query = dict(urllib.parse.parse_qsl(callback.query))
    query["resultState"] = "success"
    callback_url = urllib.parse.urlunparse(callback._replace(query=urllib.parse.urlencode(query)))
    _, location, callback_source = browser.fetch(callback_url)
    assert location
    _, location, verification_source = browser.fetch(urllib.parse.urljoin(callback_source, location))
    assert location
    _, location, redirect_source = browser.fetch(urllib.parse.urljoin(verification_source, location))
    assert location
    application_redirect = urllib.parse.urlparse(urllib.parse.urljoin(redirect_source, location))
    redirect_token = dict(urllib.parse.parse_qsl(application_redirect.query))["redirectToken"]
    return session, redirect_token, session.result_collection.results_access_key


def assert_equivalent(actual: Any, expected: Any, path: str, exact: bool) -> None:
    if isinstance(actual, dict):
        assert isinstance(expected, dict), f"{path}: SDK produced an object for {type(expected).__name__}"
        missing = set(expected) - set(actual)
        assert not exact or not missing, f"{path}: SDK omitted fixture fields: {sorted(missing)}"
        for key, item in actual.items():
            if key in expected:
                assert_equivalent(item, expected[key], f"{path}.{key}", exact)
    elif isinstance(actual, list):
        assert isinstance(expected, list) and len(actual) == len(expected), f"{path}: array shape differs"
        for index, item in enumerate(actual):
            assert_equivalent(item, expected[index], f"{path}[{index}]", exact)
    else:
        assert_json_scalar_equivalent(actual, expected, path)


def assert_json_scalar_equivalent(actual: Any, expected: Any, path: str) -> None:
    if isinstance(actual, UUID) and isinstance(expected, str):
        assert str(actual).lower() == expected.lower(), f"{path}: SDK produced {actual!r}, wire has {expected!r}"
        return
    if isinstance(actual, datetime) and isinstance(expected, str):
        parsed = datetime.fromisoformat(expected.replace("Z", "+00:00"))
        assert actual == parsed, f"{path}: SDK produced {actual!r}, wire has {expected!r}"
        return
    if isinstance(actual, date) and isinstance(expected, str):
        assert actual.isoformat() == expected, f"{path}: SDK produced {actual!r}, wire has {expected!r}"
        return
    assert isinstance(actual, bool) == isinstance(expected, bool), f"{path}: boolean/number type mismatch: {actual!r} vs {expected!r}"
    assert actual == expected, f"{path}: SDK produced {actual!r}, wire has {expected!r}"


def assert_nonempty(candidate: Any, label: str) -> None:
    assert candidate, f"Expected {label} to be non-empty."


def assert_profile_page(response: Any) -> None:
    assert_page(response, "verification_profiles")
    for profile in response.verification_profiles:
        UUID(str(profile.id))


def assert_profile_id(response: Any) -> None:
    assert normalized_uuid(response.id) == normalized_uuid(PROFILE_ID)


def assert_session_id(response: Any, expected: UUID) -> None:
    assert normalized_uuid(response.session.id) == normalized_uuid(expected)


def assert_provider(response: Any) -> None:
    assert response.provider.id == TEST_PROVIDER


def create_hosted_session(api: SessionsApi, redirects: RedirectUrisApi) -> Any:
    arguments = {"provider": TEST_PROVIDER, "verification_profile_id": str(PROFILE_ID), "redirect_url": redirect_url(redirects)}
    response = api.create_hosted_provider_session(CreateHostedProviderSessionRequest(**arguments))
    CREATED_SESSIONS.append((api, response.session_id))
    UUID(str(response.session_id))
    assert urllib.parse.urlparse(response.launch_url).scheme in {"http", "https"}
    assert response.results_access_key
    return response
