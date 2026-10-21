"""Readable API compatibility tests for one installed Python SDK target."""
from __future__ import annotations

import json
import os
from pathlib import Path
import urllib.parse

import pytest

import run_target as support


@pytest.fixture()
def apis():
    api_client = support.client()
    return (
        support.ProvidersApi(api_client),
        support.VerificationProfilesApi(api_client),
        support.SessionsApi(api_client),
        support.RedirectUrisApi(api_client),
    )


@pytest.mark.compatibility("api.providers.list")
def test_list_providers(apis) -> None:
    providers, *_ = apis
    support.assert_nonempty(support.value(providers.list_providers(), "providers"), "providers")


@pytest.mark.compatibility("api.verification-profiles.get-by-id")
def test_get_verification_profile(apis) -> None:
    _, profiles, *_ = apis
    support.assert_profile_id(profiles.get_verification_profile_by_id(str(support.PROFILE_ID)))


@pytest.mark.compatibility("api.verification-profiles.list")
def test_list_verification_profiles(apis) -> None:
    _, profiles, *_ = apis
    support.assert_profile_present(profiles.list_verification_profiles(page=1, page_size=100))


@pytest.mark.compatibility("api.sessions.list")
def test_list_sessions(apis) -> None:
    *_, sessions, _ = apis
    sessions.list_sessions(str(support.PROFILE_ID), page_size=1, page=1)


@pytest.mark.compatibility("api.redirect-uris.list")
def test_list_redirect_uris(apis) -> None:
    *_, redirects = apis
    redirects.list(page=1, page_size=1)


@pytest.mark.compatibility("api.providers.get")
def test_get_provider(apis) -> None:
    providers, *_ = apis
    if not hasattr(providers, "get_provider"):
        pytest.skip("ProvidersApi.get_provider was introduced in 3.1.0.")
    support.assert_provider(providers.get_provider(support.TEST_PROVIDER))


@pytest.mark.compatibility("api.sessions.create-hosted-provider")
def test_create_hosted_provider_session(apis) -> None:
    *_, sessions, redirects = apis
    hosted = support.create_hosted_session(sessions, redirects)
    sessions.cancel_session(hosted.session_id)


@pytest.mark.compatibility("api.sessions.create-direct-provider")
def test_create_direct_provider_session(apis) -> None:
    *_, sessions, redirects = apis
    session = support.direct_session(sessions, redirects)
    sessions.cancel_session(session.session_id)


@pytest.mark.compatibility("api.sessions.get")
def test_get_direct_session(apis) -> None:
    *_, sessions, redirects = apis
    session = support.direct_session(sessions, redirects)
    support.assert_session_id(sessions.get_session(session.session_id), session.session_id)
    sessions.cancel_session(session.session_id)


@pytest.mark.compatibility("api.sessions.cancel")
def test_cancel_direct_session(apis) -> None:
    *_, sessions, redirects = apis
    session = support.direct_session(sessions, redirects)
    sessions.cancel_session(session.session_id)


def completed_result(apis):
    *_, sessions, redirects = apis
    session, token, access_key = support.completed_session(sessions, redirects)
    result = sessions.get_session_result(session.session_id, support.GetSessionResultRequest(redirect_token=token, results_access_key=access_key))
    return sessions, session, access_key, result


@pytest.mark.compatibility("api.sessions.get-result")
def test_get_session_result(apis) -> None:
    _sessions, _session, _access_key, result = completed_result(apis)
    assert result is not None


@pytest.mark.compatibility("api.sessions.get-attachment")
def test_get_session_attachment(apis) -> None:
    sessions, session, access_key, result = completed_result(apis)
    attachments = result.identity_data.attachments if result.identity_data else []
    if not attachments:
        pytest.skip("Completed redirect session did not return an attachment.")
    sessions.get_attachment(session.session_id, attachments[0].id, support.GetAttachmentRequest(results_access_key=access_key))


@pytest.mark.compatibility("api.sessions.redact")
def test_redact_session(apis) -> None:
    sessions, session, _access_key, _result = completed_result(apis)
    sessions.redact_session(session.session_id)


@pytest.mark.compatibility("api.sessions.recommend-providers")
def test_recommend_providers(apis) -> None:
    *_, sessions, _ = apis
    sessions.recommend_providers(support.RecommendProvidersRequest(verification_profile_id=str(support.PROFILE_ID)))


def provider_fixtures():
    cache_path = os.environ.get("SDK_COMPATIBILITY_PSO_FIXTURES_PATH")
    return json.loads(Path(cache_path).read_text())["fixtures"] if cache_path else support.http_json("/api/v1/providers/sample-json/outputs")


def provider_parameters():
    values = []
    for fixture in provider_fixtures():
        parameters = {"providerId": fixture["providerId"]}
        if fixture.get("sdkModelName"):
            parameters["sdkModelName"] = fixture["sdkModelName"]
        advisory = None
        if not fixture["hasPublicSdkModel"]:
            advisory = {"code": "missing-public-provider-output", "message": f"{fixture['providerId']} does not declare a public provider-specific output model for API SDKs."}
        values.append(pytest.param(fixture, marks=pytest.mark.compatibility("serialization.provider-output-round-trip", parameters=parameters, advisory=advisory), id=fixture["providerId"]))
    return values


@pytest.mark.parametrize("fixture", provider_parameters())
def test_provider_output_round_trip(fixture) -> None:
    provider_id = fixture["providerId"]
    if not fixture["hasPublicSdkModel"]:
        pytest.skip("Provider has no public Swagger provider-specific output model.")
    model_name = fixture["sdkModelName"]
    import trinsic_api.models as models
    model = getattr(models, model_name, None)
    if model is None:
        if support.CURRENT and os.environ.get("SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS", "").lower() not in {"1", "true"}:
            raise AssertionError(f"Connect declares {provider_id}'s {model_name} output as public, but {support.TARGET} does not export {model_name}.")
        pytest.skip("The published SDK does not expose this provider-output model.")
    raw = fixture.get("output") if "output" in fixture else support.http_json(f"/api/v1/providers/{urllib.parse.quote(provider_id, safe='')}/sample-json/output")
    expected = fixture.get("serializationOutput", raw)
    serialized = model.from_dict(raw).to_dict()
    if support.CURRENT:
        support.assert_equivalent(serialized, expected, f"{provider_id} ({model_name})")
    else:
        support.assert_subset(serialized, expected, f"{provider_id} ({model_name})")
