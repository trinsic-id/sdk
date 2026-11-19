import os
from uuid import UUID
from trinsic_api import ApiClient, Configuration, ProvidersApi, SessionsApi

config = Configuration(host=os.environ["SDK_TEST_URL"], access_token="sdk-header-test-token")
with ApiClient(config) as client:
    # Replacing default headers must not remove SDK identification.
    client.default_headers = {"X-Test-Header": "preserved"}
    ProvidersApi(client).list_providers_without_preload_content().read()
    SessionsApi(client).cancel_session_without_preload_content(
        UUID("00000000-0000-0000-0000-000000000001"),
        _headers={"X-Request-Header": "also-preserved"},
    ).read()
