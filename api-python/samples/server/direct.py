from fastapi import Request, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from trinsic_api.api.sessions_api import SessionsApi, CreateDirectProviderSessionRequest, GetSessionResultRequest, RefreshStepContentRequest
import os
from fastapi.responses import RedirectResponse
import json
from datetime import date, datetime
from uuid import UUID

directRouter = APIRouter()

@directRouter.get("/direct")
async def direct():
    return RedirectResponse(url="/direct.html")

@directRouter.post("/create-direct-session/{provider_id}")
async def launch(request: Request, provider_id: str, sessions_api: SessionsApi = Depends()):
    fallbackToTrinsicUI = request.query_params.get("fallbackToTrinsicUI", "").strip().lower() == "true"

    session_request = CreateDirectProviderSessionRequest(
        provider=provider_id,
        verification_profile_id=os.getenv("TRINSIC_VERIFICATION_PROFILE_ID"),
        redirect_url=request.query_params.get("redirectUrl"),
        enable_redirect_backwards_compatibility=False,
        fallback_to_hosted_ui=fallbackToTrinsicUI,
        capabilities=request.query_params.get("capabilities").split(","),
    )

    result = sessions_api.create_direct_provider_session(create_direct_provider_session_request=session_request)
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))

def json_serial(obj):
    """JSON serializer for objects not serializable by default."""
    if isinstance(obj, UUID):
        return str(obj)
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

@directRouter.post("/poll-results/{session_id}")
async def poll_results(session_id: str, request: Request, sessions_api: SessionsApi = Depends()):
    request_payload = await request.json()
    results_access_key = request_payload.get("resultsAccessKey")
    
    if not results_access_key:
        raise HTTPException(status_code=400, detail="Missing resultsAccessKey")
    
    result_request = GetSessionResultRequest(results_access_key=results_access_key)
    if request_payload.get("redirectToken") is not None:
        result_request.redirect_token = request_payload["redirectToken"]
    result = sessions_api.get_session_result(session_id, result_request)
    
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))

@directRouter.post("/refresh-content/{session_id}")
async def refresh_content(session_id: str, request: Request, sessions_api: SessionsApi = Depends()):
    request_payload = await request.json()
    results_access_key = request_payload.get("resultsAccessKey")
    
    if not results_access_key:
        raise HTTPException(status_code=400, detail="Missing resultsAccessKey")
    
    result = sessions_api.refresh_step_content(session_id, RefreshStepContentRequest(results_access_key=results_access_key))
    
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))
