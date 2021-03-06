import asyncio
import platform

from trinsic.proto.services.account.v1 import AuthorizeWebhookRequest, LoginRequest
from trinsic.trinsic_service import TrinsicService
from trinsic.trinsic_util import trinsic_config


async def account_demo():
    config = trinsic_config()

    trinsic = TrinsicService(server_config=config)

    ecosystem = await trinsic.provider.create_ecosystem()
    ecosystem_id = ecosystem.ecosystem.id

    trinsic.service_options.default_ecosystem = ecosystem_id

    # loginRequest() {
    login_response = await trinsic.account.login(
        request=LoginRequest(email="bob@example.com")
    )
    # }

    # We expect this to fail because this is a fake auth code
    try:
        # loginConfirm() {
        auth_token = await trinsic.account.login_confirm(
            challenge=login_response.challenge, auth_code="12345"
        )
        # }

        assert False  # If we get here, it means login succeeded -- which is an error.
    except:
        pass

    # Log into an anonymous account to do the rest of the test
    await trinsic.account.login_anonymous()

    # authorizeWebhook() {
    request = AuthorizeWebhookRequest()
    request.events.append("*")
    response = await trinsic.account.authorize_webhook(request=request)
    # }

    trinsic.close()


if __name__ == "__main__":
    if platform.system() == "Windows":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(account_demo())
