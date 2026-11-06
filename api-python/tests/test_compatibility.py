"""Readable API compatibility tests for one installed Python SDK target."""
from __future__ import annotations

import json
import os
from pathlib import Path

import pytest

import compatibility_support as support


@pytest.fixture()
def apis():
    api_client = support.client()
    return (
        support.ProvidersApi(api_client),
        support.VerificationProfilesApi(api_client),
        support.SessionsApi(api_client),
        support.RedirectUrisApi(api_client),
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
    providers, *_ = apis
    support.assert_nonempty(support.value(providers.list_providers(), "providers"), "providers")


@pytest.mark.compatibility("api.verification-profiles.get-by-id")
def test_get_verification_profile(apis) -> None:
    _, profiles, *_ = apis
    support.assert_profile_id(profiles.get_verification_profile_by_id(str(support.PROFILE_ID)))


@pytest.mark.compatibility("api.verification-profiles.list")
def test_list_verification_profiles(apis) -> None:
    _, profiles, *_ = apis
    support.assert_profile_page(profiles.list_verification_profiles(page=1, page_size=100))


def test_profile_list_accepts_a_page_without_the_configured_profile() -> None:
    from types import SimpleNamespace
    from uuid import uuid4
    response = SimpleNamespace(verification_profiles=[SimpleNamespace(id=uuid4())], more=True)
    profiles = SimpleNamespace(list_verification_profiles=lambda **_kwargs: response)
    test_list_verification_profiles((None, profiles))


@pytest.mark.compatibility("api.sessions.list")
def test_list_sessions(apis) -> None:
    *_, sessions, _ = apis
    response = sessions.list_sessions(str(support.PROFILE_ID), page_size=1, page=1)
    support.assert_page(response, "sessions")
    assert isinstance(response.total, int) and not isinstance(response.total, bool) and response.total >= 0
    support.assert_request(sessions, query={"Page": 1, "PageSize": 1})


@pytest.mark.compatibility("api.redirect-uris.list")
def test_list_redirect_uris(apis) -> None:
    *_, redirects = apis
    support.assert_page(redirects.list(page=1, page_size=1), "uris")
    support.assert_request(redirects, query={"page": 1, "pageSize": 1})


@pytest.mark.compatibility("api.providers.get")
def test_get_provider(apis) -> None:
    providers, *_ = apis
    support.assert_provider(providers.get_provider(support.TEST_PROVIDER))


@pytest.mark.compatibility("api.sessions.create-hosted-provider")
def test_create_hosted_provider_session(apis) -> None:
    *_, sessions, redirects = apis
    support.create_hosted_session(sessions, redirects)


@pytest.mark.compatibility("api.sessions.create-direct-provider")
def test_create_direct_provider_session(apis) -> None:
    *_, sessions, redirects = apis
    support.direct_session(sessions, redirects)


@pytest.mark.compatibility("api.sessions.get")
def test_get_direct_session(apis) -> None:
    *_, sessions, redirects = apis
    session = support.direct_session(sessions, redirects)
    support.assert_session(sessions.get_session(session.session_id), session.session_id, False, False)


@pytest.mark.compatibility("api.sessions.cancel")
def test_cancel_direct_session(apis) -> None:
    *_, sessions, redirects = apis
    session = support.direct_session(sessions, redirects)
    support.assert_session(sessions.cancel_session(session.session_id), session.session_id, True, False)


def completed_result(apis):
    *_, sessions, redirects = apis
    session, token, access_key = support.completed_session(sessions, redirects)
    result = sessions.get_session_result(session.session_id, support.GetSessionResultRequest(results_access_key=access_key))
    return sessions, session, access_key, result


@pytest.mark.compatibility("api.sessions.get-result")
def test_get_session_result(apis) -> None:
    _sessions, session, _access_key, result = completed_result(apis)
    support.assert_session(result, session.session_id, True, True)
    assert result.identity_data.originating_provider_id == support.TEST_PROVIDER
    assert result.identity_data.attachments


@pytest.mark.compatibility("api.sessions.get-attachment")
def test_get_session_attachment(apis) -> None:
    sessions, session, access_key, result = completed_result(apis)
    attachments = result.identity_data.attachments if result.identity_data else []
    assert attachments, "Completed redirect session did not return an attachment."
    support.assert_attachment(sessions.get_attachment(session.session_id, attachments[0].id, support.GetAttachmentRequest(results_access_key=access_key)))


@pytest.mark.compatibility("api.sessions.redact")
def test_redact_session(apis) -> None:
    *_, sessions, redirects = apis
    session, _token, _access_key = support.completed_session(sessions, redirects)
    sessions.redact_session(session.session_id)


@pytest.mark.compatibility("api.sessions.recommend-providers")
def test_recommend_providers(apis) -> None:
    *_, sessions, _ = apis
    support.assert_recommendations(sessions.recommend_providers(support.RecommendProvidersRequest(verification_profile_id=str(support.PROFILE_ID))))
    support.assert_request(sessions, body={"verificationProfileId": str(support.PROFILE_ID)})


def provider_fixtures():
    return json.loads(Path(os.environ["SDK_COMPATIBILITY_PSO_FIXTURES_PATH"]).read_text())["fixtures"]


def provider_parameters():
    values = []
    for fixture in provider_fixtures():
        parameters = {"providerId": fixture["providerId"]}
        if fixture.get("sdkModelName"):
            parameters["sdkModelName"] = fixture["sdkModelName"]
        advisory = None
        if not fixture["hasPublicSdkModel"]:
            advisory = {"code": "missing-public-provider-output", "message": f"{fixture['providerId']} does not declare a public provider-specific output model for API SDKs."}
        values.append(pytest.param(fixture, marks=pytest.mark.compatibility(fixture.get("testCaseId", "serialization.provider-output-round-trip"), parameters=parameters, advisory=advisory), id=fixture["providerId"]))
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
    decoded = model.from_dict(raw)
    support.assert_equivalent(support.model_fields(decoded, raw, decoded=True), support.model_fields(decoded, raw), provider_id, True)
    serialized = decoded.to_dict()
    expected = expected if fixture.get("testCaseId") else support.model_fields(decoded, expected, omit_optional_nulls=True)
    support.assert_equivalent(serialized, expected, f"{provider_id} ({model_name})", True)


@pytest.mark.parametrize("actual,expected", [(True, 1), (False, 0), (1, True), (0, False)])
def test_provider_output_boolean_number_mismatch(actual, expected):
    with pytest.raises(AssertionError, match="boolean/number"):
        support.assert_equivalent(actual, expected, "value", True)


def test_provider_output_dropped_known_fields_and_dictionary_entries():
    from pydantic import BaseModel
    class Child(BaseModel):
        name: str | None = None
    class Parent(BaseModel):
        child: Child
        entries: dict[str, Child]
    raw = {"child": {"name": "Ada", "future": True}, "entries": {"one": {"name": "Bob"}}}
    good = Parent.model_validate(raw)
    support.assert_equivalent(support.model_fields(good, raw, True), support.model_fields(good, raw), "provider", True)
    good.child.name = None
    with pytest.raises(AssertionError):
        support.assert_equivalent(support.model_fields(good, raw, True), support.model_fields(good, raw), "provider", True)
    good.entries.clear()
    with pytest.raises(AssertionError, match="dictionary keys"):
        support.model_fields(good, raw, True)


def test_semantic_assertions_reject_wrong_session_and_empty_attachment():
    from types import SimpleNamespace as Obj
    with pytest.raises(AssertionError):
        support.assert_session(Obj(session=Obj(id="wrong", done=True, success=True)), "expected", True, True)
    with pytest.raises(AssertionError):
        support.assert_attachment(Obj(content_type="image/png", content=""))


@pytest.mark.parametrize("actual,expected", [(1, 1.0), (True, True), (False, False), (None, None)])
def test_provider_output_equal_scalars(actual, expected):
    support.assert_equivalent(actual, expected, "value", True)
