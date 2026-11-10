import os
from uuid import UUID
from trinsic_api import ApiClient, Configuration, SessionsApi, CreateHostedProviderSessionRequest, ProviderInput, BrazilCpfCheckInput

common = dict(provider="provider", verification_profile_id=UUID("00000000-0000-0000-0000-000000000001"))
with ApiClient(Configuration(host=os.environ["SDK_TEST_URL"])) as client:
    for value in [b"\x00\xff+/", "AP8rLw==", b""]:
        model = CreateHostedProviderSessionRequest(**common, redirect_url="https://example.test", enable_redirect_backwards_compatibility=False, provider_input=ProviderInput(brazil_cpf_lookup=BrazilCpfCheckInput(selfie_image=value)))
        SessionsApi(client).create_hosted_provider_session_without_preload_content(model).read()
    assert client.sanitize_for_serialization({"nested": [b"\xff", None]}) == {"nested": ["/w==", None]}
