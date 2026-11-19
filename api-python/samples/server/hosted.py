from fastapi import Request, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from trinsic_api.api.sessions_api import SessionsApi, CreateHostedProviderSessionRequest
from fastapi.responses import RedirectResponse
from datetime import date, datetime
from uuid import UUID
import os
import json

hostedRouter = APIRouter()
@hostedRouter.get("/hosted")
async def redirect():
    return RedirectResponse(url="/hosted.html")


@hostedRouter.post("/create-hosted-session/{provider_id}")
async def launch(request: Request, provider_id: str, sessions_api: SessionsApi = Depends()):
    session_request = CreateHostedProviderSessionRequest(
        provider=provider_id,
        verification_profile_id=os.getenv("TRINSIC_VERIFICATION_PROFILE_ID"),
        redirect_url=request.query_params.get("redirectUrl"),
        enable_redirect_backwards_compatibility=False,
    )

    result = sessions_api.create_hosted_provider_session(create_hosted_provider_session_request=session_request)
    
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))
def json_serial(obj):
    """JSON serializer for objects not serializable by default."""
    if isinstance(obj, UUID):
        return str(obj)
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")