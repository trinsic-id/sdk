#!/usr/bin/env python3
"""Execute one installed Python SDK target and write normalized case results."""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime
from pathlib import Path
from typing import Any
from uuid import UUID

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
CURRENT = os.environ.get("SDK_IS_CURRENT") == "true"
TARGET = os.environ["SDK_TARGET_LABEL"]
RESULT_PATH = Path(os.environ["SDK_COMPATIBILITY_RESULT_FILE"])
TEST_PROVIDER = "trinsic-test-redirect"
results: list[dict[str, Any]] = []


def record(identifier: str, action, parameters: dict[str, str] | None = None):
    started = time.perf_counter()
    try:
        value = None
        for attempt in range(3):
            try:
                value = action()
                break
            except Exception as error:
                if attempt == 2 or "Connection reset by peer" not in str(error):
                    raise
                time.sleep(0.25 * (attempt + 1))
        entry: dict[str, Any] = {"durationMs": round((time.perf_counter() - started) * 1000, 3), "id": identifier, "status": "passed"}
        if parameters:
            entry["parameters"] = parameters
        results.append(entry)
        return value
    except Exception as error:  # retain independent case records after a target error
        entry = {"durationMs": round((time.perf_counter() - started) * 1000, 3), "failure": {"name": type(error).__name__, "message": str(error)}, "id": identifier, "status": "failed"}
        if parameters:
            entry["parameters"] = parameters
        results.append(entry)
        return None


def skipped(identifier: str, reason: str, parameters: dict[str, str] | None = None, advisory: dict[str, str] | None = None) -> None:
    entry: dict[str, Any] = {"durationMs": 0, "id": identifier, "skipReason": reason, "status": "skipped"}
    if parameters:
        entry["parameters"] = parameters
    if advisory:
        entry["advisory"] = advisory
    results.append(entry)


def client() -> ApiClient:
    configuration = Configuration(host=BASE_URL)
    configuration.access_token = TOKEN
    return ApiClient(configuration)


def value(model: Any, field: str) -> Any:
    return getattr(model, field)


def normalized_uuid(candidate: Any) -> str:
    return str(candidate).lower()


def http_json(path: str) -> Any:
    request = urllib.request.Request(f"{BASE_URL}{path}", headers={"Accept": "application/json", "Authorization": f"Bearer {TOKEN}"})
    with urllib.request.urlopen(request) as response:  # noqa: S310 -- test URL is configured explicitly
        return json.loads(response.read())


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


def direct_session(api: SessionsApi, redirects: RedirectUrisApi):
    arguments = {
        "provider": TEST_PROVIDER,
        "verification_profile_id": str(PROFILE_ID),
        "redirect_url": redirect_url(redirects),
        "capabilities": [IntegrationCapability.LAUNCHBROWSER, IntegrationCapability.CAPTUREREDIRECT],
        "fallback_to_hosted_ui": False,
    }
    if "enable_redirect_backwards_compatibility" in CreateDirectProviderSessionRequest.model_fields:
        arguments["enable_redirect_backwards_compatibility"] = False
    request = CreateDirectProviderSessionRequest(
        **arguments,
    )
    response = api.create_direct_provider_session(request)
    assert response.session_id
    assert response.next_step.content
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


def assert_equivalent(actual: Any, expected: Any, path: str) -> None:
    if isinstance(actual, dict):
        assert isinstance(expected, dict), f"{path}: SDK produced an object for {type(expected).__name__}"
        assert set(actual) == set(expected), f"{path}: field names differ; SDK={sorted(actual)}, wire={sorted(expected)}"
        for key, item in actual.items():
            assert_equivalent(item, expected[key], f"{path}.{key}")
    elif isinstance(actual, list):
        assert isinstance(expected, list) and len(actual) == len(expected), f"{path}: array shape differs"
        for index, item in enumerate(actual):
            assert_equivalent(item, expected[index], f"{path}[{index}]")
    else:
        assert_json_scalar_equivalent(actual, expected, path)


def assert_subset(actual: Any, expected: Any, path: str) -> None:
    if isinstance(actual, dict):
        assert isinstance(expected, dict), f"{path}: SDK produced an object for {type(expected).__name__}"
        for key, item in actual.items():
            assert key in expected, f"{path}: SDK emitted field {key!r} absent from the wire fixture"
            assert_subset(item, expected[key], f"{path}.{key}")
    elif isinstance(actual, list):
        assert isinstance(expected, list) and len(actual) == len(expected), f"{path}: array shape differs"
        for index, item in enumerate(actual):
            assert_subset(item, expected[index], f"{path}[{index}]")
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
    assert actual == expected, f"{path}: SDK produced {actual!r}, wire has {expected!r}"


def provider_outputs() -> None:
    catalog = http_json("/api/v1/providers/sample-json/outputs")
    assert isinstance(catalog, list) and catalog
    import trinsic_api.models as models
    for fixture in catalog:
        provider_id = fixture["providerId"]
        parameters = {"providerId": provider_id}
        if not fixture["hasPublicSdkModel"]:
            skipped("serialization.provider-output-round-trip", "Provider has no public Swagger provider-specific output model.", parameters, {"code": "missing-public-provider-output", "message": f"{provider_id} does not declare a public provider-specific output model for API SDKs."})
            continue
        model_name = fixture.get("sdkModelName")
        assert isinstance(model_name, str)
        parameters["sdkModelName"] = model_name
        model = getattr(models, model_name, None)
        if model is None:
            if CURRENT:
                record("serialization.provider-output-round-trip", lambda: (_ for _ in ()).throw(AssertionError(f"Connect declares {provider_id}'s {model_name} output as public, but {TARGET} does not export {model_name}.")), parameters)
            else:
                skipped("serialization.provider-output-round-trip", "The published SDK does not expose this provider-output model.", parameters)
            continue
        raw = http_json(f"/api/v1/providers/{urllib.parse.quote(provider_id, safe='')}/sample-json/output")
        def round_trip() -> None:
            serialized = model.from_dict(raw).to_dict()
            if CURRENT:
                assert_equivalent(serialized, raw, f"{provider_id} ({model_name})")
            else:
                assert_subset(serialized, raw, f"{provider_id} ({model_name})")
        record("serialization.provider-output-round-trip", round_trip, parameters)


def main() -> None:
    api_client = client()
    providers, profiles, sessions, redirects = ProvidersApi(api_client), VerificationProfilesApi(api_client), SessionsApi(api_client), RedirectUrisApi(api_client)
    record("api.providers.list", lambda: assert_nonempty(value(providers.list_providers(), "providers"), "providers"))
    record("api.verification-profiles.get-by-id", lambda: assert_profile_id(profiles.get_verification_profile_by_id(str(PROFILE_ID))))
    record("api.verification-profiles.list", lambda: assert_profile_present(profiles.list_verification_profiles(page=1, page_size=100)))
    record("api.sessions.list", lambda: sessions.list_sessions(str(PROFILE_ID), page_size=1, page=1))
    record("api.redirect-uris.list", lambda: redirects.list(page=1, page_size=1))
    if hasattr(providers, "get_provider"):
        record("api.providers.get", lambda: assert_provider(providers.get_provider(TEST_PROVIDER)))
    else:
        skipped("api.providers.get", "ProvidersApi.get_provider was introduced in 3.1.0.")
    hosted = record("api.sessions.create-hosted-provider", lambda: create_hosted_session(sessions, redirects))
    if hosted is not None:
        sessions.cancel_session(hosted.session_id)
    direct = record("api.sessions.create-direct-provider", lambda: direct_session(sessions, redirects))
    if direct is not None:
        record("api.sessions.get", lambda: assert_session_id(sessions.get_session(direct.session_id), direct.session_id))
        record("api.sessions.cancel", lambda: sessions.cancel_session(direct.session_id))
    else:
        skipped("api.sessions.get", "Direct-session setup failed.")
        skipped("api.sessions.cancel", "Direct-session setup failed.")
    completed: tuple[Any, str, str] | None = None

    def get_completed_result() -> Any:
        nonlocal completed
        completed = completed_session(sessions, redirects)
        session, token, access_key = completed
        return sessions.get_session_result(session.session_id, GetSessionResultRequest(redirect_token=token, results_access_key=access_key))

    result = record("api.sessions.get-result", get_completed_result)
    if completed is None or result is None:
        for identifier in ("api.sessions.get-attachment", "api.sessions.redact"):
            skipped(identifier, "Redirect-session setup or result retrieval failed.")
    else:
        session, _token, access_key = completed
        attachment_id = result.identity_data.attachments[0].id if result and result.identity_data and result.identity_data.attachments else None
        if attachment_id:
            record("api.sessions.get-attachment", lambda: sessions.get_attachment(session.session_id, attachment_id, GetAttachmentRequest(results_access_key=access_key)))
        else:
            skipped("api.sessions.get-attachment", "Completed redirect session did not return an attachment.")
        record("api.sessions.redact", lambda: sessions.redact_session(session.session_id))
    record("api.sessions.recommend-providers", lambda: sessions.recommend_providers(RecommendProvidersRequest(verification_profile_id=str(PROFILE_ID))))
    provider_outputs()
    RESULT_PATH.parent.mkdir(parents=True, exist_ok=True)
    RESULT_PATH.write_text(json.dumps({"schemaVersion": 1, "testCases": results}, indent=2) + "\n")
    if any(item["status"] == "failed" for item in results):
        raise SystemExit(1)


def assert_nonempty(candidate: Any, label: str) -> None:
    assert candidate, f"Expected {label} to be non-empty."


def assert_profile_present(response: Any) -> None:
    assert any(normalized_uuid(profile.id) == normalized_uuid(PROFILE_ID) for profile in response.verification_profiles)


def assert_profile_id(response: Any) -> None:
    assert normalized_uuid(response.id) == normalized_uuid(PROFILE_ID)


def assert_session_id(response: Any, expected: UUID) -> None:
    assert normalized_uuid(response.session.id) == normalized_uuid(expected)


def assert_provider(response: Any) -> None:
    assert response.provider.id == TEST_PROVIDER


def create_hosted_session(api: SessionsApi, redirects: RedirectUrisApi) -> Any:
    arguments = {"provider": TEST_PROVIDER, "verification_profile_id": str(PROFILE_ID), "redirect_url": redirect_url(redirects)}
    if "enable_redirect_backwards_compatibility" in CreateHostedProviderSessionRequest.model_fields:
        arguments["enable_redirect_backwards_compatibility"] = False
    return api.create_hosted_provider_session(CreateHostedProviderSessionRequest(**arguments))


if __name__ == "__main__":
    main()
