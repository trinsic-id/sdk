from fastapi import Request, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from trinsic_api.api.sessions_api import SessionsApi, CreateHostedProviderSessionRequest
from fastapi.responses import RedirectResponse
import os
import json

hostedRouter = APIRouter()
@hostedRouter.get("/hosted")
async def redirect():
    return RedirectResponse(url="/hosted.html")


@hostedRouter.post("/create-hosted-session/{provider_id}")
async def launch(request: Request, provider_id: str, sessions_api: SessionsApi = Depends()):
    request = CreateHostedProviderSessionRequest(redirect_url = request.query_params.get("redirectUrl"), verification_profile_id=os.getenv("TRINSIC_VERIFICATION_PROFILE_ID"), provider=provider_id)

    result = sessions_api.create_hosted_provider_session(create_hosted_provider_session_request=request)
    
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))
def json_serial(obj):
    """JSON serializer for objects not serializable by default."""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")