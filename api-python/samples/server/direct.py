from fastapi import Request, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from trinsic_api.api.sessions_api import SessionsApi, CreateDirectProviderSessionRequest, GetSessionResultRequest, RefreshStepContentRequest
import os
from urllib.parse import urlencode
from datetime import datetime, timezone
from fastapi.responses import RedirectResponse
import json
from datetime import date, datetime

directRouter = APIRouter()

@directRouter.get("/direct")
async def direct():
    return RedirectResponse(url="/direct.html")

@directRouter.get("/direct-popup")
async def directPopup(request: Request):
    return RedirectResponse(url=f"/direct-popup.html?{request.query_params}")


@directRouter.post("/create-direct-session/{provider_id}")
async def launch(request: Request, provider_id: str, sessions_api: SessionsApi = Depends()):
    fallbackToTrinsicUI = request.query_params.get("fallbackToTrinsicUI", "").strip().lower() == "true"

    request = CreateDirectProviderSessionRequest(redirect_url = request.query_params.get("redirectUrl"), verification_profile_id=os.getenv("TRINSIC_VERIFICATION_PROFILE_ID"), provider=provider_id, fallback_to_hosted_ui = fallbackToTrinsicUI, capabilities = request.query_params.get("capabilities").split(","))

    result = sessions_api.create_direct_provider_session(create_direct_provider_session_request=request)
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))

def json_serial(obj):
    """JSON serializer for objects not serializable by default."""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

@directRouter.post("/poll-results/{session_id}")
async def poll_results(session_id: str, request: Request, sessions_api: SessionsApi = Depends()):
    request_payload = await request.json()
    results_access_key = request_payload.get("resultsAccessKey")
    
    if not results_access_key:
        raise HTTPException(status_code=400, detail="Missing resultsAccessKey")
    
    result = sessions_api.get_session_result(session_id, GetSessionResultRequest(results_access_key=results_access_key))
    
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))

@directRouter.post("/refresh-content/{session_id}")
async def refresh_content(session_id: str, request: Request, sessions_api: SessionsApi = Depends()):
    request_payload = await request.json()
    results_access_key = request_payload.get("resultsAccessKey")
    
    if not results_access_key:
        raise HTTPException(status_code=400, detail="Missing resultsAccessKey")
    
    result = sessions_api.refresh_step_content(session_id, RefreshStepContentRequest(results_access_key=results_access_key))
    
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))