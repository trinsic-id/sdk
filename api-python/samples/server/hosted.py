from fastapi import Request, APIRouter, Depends, HTTPException
from pydantic import BaseModel
from trinsic_api.api.sessions_api import SessionsApi, CreateHostedProviderSessionRequest
from fastapi.responses import RedirectResponse
import os
hostedRouter = APIRouter()
@hostedRouter.get("/hosted")
async def redirect():
    return RedirectResponse(url="/hosted.html")


@hostedRouter.get("/hosted-launch/{provider_id}")
async def launch(request: Request, provider_id: str, sessions_api: SessionsApi = Depends()):
    request = CreateHostedProviderSessionRequest(redirect_url = request.query_params.get("redirectUrl"), verification_profile_id=os.getenv("TRINSIC_VERIFICATION_PROFILE_ID"), provider=provider_id)

    data = sessions_api.create_hosted_provider_session(create_hosted_provider_session_request=request)

    if (data.launch_url is None):
        raise Exception("No launch URL returned from Trinsic API")
    
    return RedirectResponse(url=data.launch_url)