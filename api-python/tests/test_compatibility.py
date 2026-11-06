"""Readable API compatibility tests for one installed Python SDK target."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path

import pytest

import compatibility_support as support


@dataclass
class Apis:
    providers: support.ProvidersApi
    profiles: support.VerificationProfilesApi
    sessions: support.SessionsApi
    redirects: support.RedirectUrisApi


@pytest.fixture()
def apis():
    api_client = support.client()
    return Apis(
        providers=support.ProvidersApi(api_client),
        profiles=support.VerificationProfilesApi(api_client),
        sessions=support.SessionsApi(api_client),
        redirects=support.RedirectUrisApi(api_client),
    )


@pytest.fixture(autouse=True)
def clean_up_created_sessions():
    yield
    for api, session_id in support.CREATED_SESSIONS:
        try:
            api.cancel_session(session_id)
        except Exception:
            pass  # Completed/redacted sessions may no longer be cancellable.
    support.CREATED_SESSIONS.clear()


@pytest.mark.compatibility("api.providers.list")
def test_list_providers(apis) -> None:
    support.checked_response(apis.providers.list_providers_with_http_info())


@pytest.mark.compatibility("api.verification-profiles.get-by-id")
def test_get_verification_profile(apis) -> None:
    support.assert_profile_id(
        support.checked_response(
            apis.profiles.get_verification_profile_by_id_with_http_info(
                str(support.PROFILE_ID)
            )
        )
    )


@pytest.mark.compatibility("api.verification-profiles.list")
def test_list_verification_profiles(apis) -> None:
    support.assert_profile_page(
        support.checked_response(
            apis.profiles.list_verification_profiles_with_http_info(
                page=1, page_size=100
            )
        )
    )


def test_profile_list_accepts_a_page_without_the_configured_profile() -> None:
    from types import SimpleNamespace
    from uuid import uuid4
    from trinsic_api.models.list_verification_profiles_response import (
        ListVerificationProfilesResponse,
    )

    raw = {
        "verificationProfiles": [
            {
                "id": str(uuid4()),
                "alias": "another",
                "brandName": "Other",
                "logoUrl": "https://example.com/logo",
                "primaryColor": "#000000",
                "enabledProviders": [],
                "sessionExpiration": "01:00:00",
                "isProductionUsage": False,
            }
        ],
        "more": True,
    }
    response = SimpleNamespace(
        status_code=200,
        data=ListVerificationProfilesResponse.from_dict(raw),
        raw_data=json.dumps(raw),
    )
    profiles = SimpleNamespace(
        list_verification_profiles_with_http_info=lambda **_kwargs: response
    )
    test_list_verification_profiles(Apis(None, profiles, None, None))


@pytest.mark.compatibility("api.sessions.list")
def test_list_sessions(apis) -> None:
    support.checked_response(
        apis.sessions.list_sessions_with_http_info(
            str(support.PROFILE_ID), page_size=1, page=1
        )
    )


@pytest.mark.compatibility("api.redirect-uris.list")
def test_list_redirect_uris(apis) -> None:
    support.checked_response(apis.redirects.list_with_http_info(page=1, page_size=1))


@pytest.mark.compatibility("api.providers.get")
def test_get_provider(apis) -> None:
    support.assert_provider(
        support.checked_response(
            apis.providers.get_provider_with_http_info(support.TEST_PROVIDER)
        )
    )


@pytest.mark.compatibility("api.sessions.create-hosted-provider")
def test_create_hosted_provider_session(apis) -> None:
    hosted = support.create_hosted_session(apis.sessions, apis.redirects)
    support.checked_response(
        apis.sessions.cancel_session_with_http_info(hosted.session_id)
    )


@pytest.mark.compatibility("api.sessions.create-direct-provider")
def test_create_direct_provider_session(apis) -> None:
    session = support.direct_session(apis.sessions, apis.redirects)
    support.checked_response(
        apis.sessions.cancel_session_with_http_info(session.session_id)
    )


@pytest.mark.compatibility("api.sessions.get")
def test_get_direct_session(apis) -> None:
    session = support.direct_session(apis.sessions, apis.redirects)
    fetched = support.checked_response(
        apis.sessions.get_session_with_http_info(session.session_id)
    )
    support.assert_session_id(fetched, session.session_id)
    assert fetched.session.done is False
    support.checked_response(
        apis.sessions.cancel_session_with_http_info(session.session_id)
    )


@pytest.mark.compatibility("api.sessions.cancel")
def test_cancel_direct_session(apis) -> None:
    session = support.direct_session(apis.sessions, apis.redirects)
    cancelled = support.checked_response(
        apis.sessions.cancel_session_with_http_info(session.session_id)
    )
    support.assert_session_id(cancelled, session.session_id)
    assert cancelled.session.done is True
    assert cancelled.session.success is False


def completed_result(apis):
    session, _token, access_key = support.completed_session(
        apis.sessions, apis.redirects
    )
    result = support.checked_response(
        apis.sessions.get_session_result_with_http_info(
            session.session_id,
            support.GetSessionResultRequest(results_access_key=access_key),
        )
    )
    support.assert_session_id(result, session.session_id)
    assert result.session.done is True
    assert result.session.success is True
    assert result.identity_data.originating_provider_id == support.TEST_PROVIDER
    assert result.identity_data.attachments
    return session, access_key, result


@pytest.mark.compatibility("api.sessions.get-result")
def test_get_session_result(apis) -> None:
    _session, _access_key, result = completed_result(apis)
    assert result is not None


@pytest.mark.compatibility("api.sessions.get-attachment")
def test_get_session_attachment(apis) -> None:
    session, access_key, result = completed_result(apis)
    attachments = result.identity_data.attachments if result.identity_data else []
    assert attachments, "Completed redirect session did not return an attachment."
    attachment = support.checked_response(
        apis.sessions.get_attachment_with_http_info(
            session.session_id,
            attachments[0].id,
            support.GetAttachmentRequest(results_access_key=access_key),
        )
    )
    assert attachment.content
    assert attachment.content_type == "image/png"


@pytest.mark.compatibility("api.sessions.redact")
def test_redact_session(apis) -> None:
    session, _token, _access_key = support.completed_session(
        apis.sessions, apis.redirects
    )
    response = apis.sessions.redact_session_with_http_info(session.session_id)
    assert 200 <= response.status_code < 300
    assert response.data is None


@pytest.mark.compatibility("api.sessions.recommend-providers")
def test_recommend_providers(apis) -> None:
    support.checked_response(
        apis.sessions.recommend_providers_with_http_info(
            support.RecommendProvidersRequest(
                verification_profile_id=str(support.PROFILE_ID)
            )
        )
    )


def provider_fixtures():
    return json.loads(
        Path(os.environ["SDK_COMPATIBILITY_PSO_FIXTURES_PATH"]).read_text()
    )["fixtures"]


def provider_parameters():
    values = []
    for fixture in provider_fixtures():
        parameters = {"providerId": fixture["providerId"]}
        if fixture.get("sdkModelName"):
            parameters["sdkModelName"] = fixture["sdkModelName"]
        advisory = None
        if not fixture["hasPublicSdkModel"]:
            advisory = {
                "code": "missing-public-provider-output",
                "message": f"{fixture['providerId']} does not declare a public provider-specific output model for API SDKs.",
            }
        values.append(
            pytest.param(
                fixture,
                marks=pytest.mark.compatibility(
                    fixture.get(
                        "testCaseId", "serialization.provider-output-round-trip"
                    ),
                    parameters=parameters,
                    advisory=advisory,
                ),
                id=fixture["providerId"],
            )
        )
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
        pytest.skip("Model is not exported by this SDK release.")
    raw = fixture["output"]
    expected = fixture.get("serializationOutput", raw)
    serialized = model.from_dict(raw).to_dict()
    support.assert_equivalent(
        serialized,
        expected,
        f"{provider_id} ({model_name})",
        bool(fixture.get("testCaseId")),
    )
