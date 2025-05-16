from fastapi import Request, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from trinsic_api.api.sessions_api import SessionsApi, CreateAdvancedProviderSessionRequest, GetSessionResultRequest, RefreshStepContentRequest

from urllib.parse import urlencode
from datetime import datetime, timezone
from fastapi.responses import RedirectResponse
import json
from datetime import date, datetime

advancedRouter = APIRouter()

@advancedRouter.get("/advanced")
async def advanced():
    return RedirectResponse(url="/advanced.html")

@advancedRouter.get("/advanced-popup")
async def advancedPopup(request: Request):
    return RedirectResponse(url=f"/advanced-popup.html?{request.query_params}")


@advancedRouter.get("/advanced-launch/{provider_id}")
async def launch(request: Request, provider_id: str, sessions_api: SessionsApi = Depends()):
    fallbackToTrinsicUI = request.query_params.get("fallbackToTrinsicUI", "").strip().lower() == "true"
    
    request = CreateAdvancedProviderSessionRequest(redirect_url = request.query_params.get("redirectUrl"), provider=provider_id, fallback_to_hosted_ui = fallbackToTrinsicUI, capabilities = request.query_params.get("capabilities").split(","))

    result = sessions_api.create_advanced_provider_session(create_advanced_provider_session_request=request)
    if result.next_step.method == 'LaunchBrowser':
        return RedirectResponse(result.next_step.content)
    else:
        should_refresh = result.next_step.refresh is not None
        refresh_after = (
            result.next_step.refresh.refresh_after.isoformat()
            if should_refresh else
            datetime.now(timezone.utc).isoformat()
        )

        print()

        query_params = {
            "sessionId": result.session_id,
            "resultsAccessKey": result.result_collection.results_access_key,
            "nextStep": result.next_step.method.value,
            "content": result.next_step.content,
            "shouldRefresh": str(should_refresh).lower(),
            "refreshAfter": refresh_after
        }

        return RedirectResponse(f"/advanced-popup?{urlencode(query_params)}")

def json_serial(obj):
    """JSON serializer for objects not serializable by default."""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

@advancedRouter.post("/poll-results/{session_id}")
async def poll_results(session_id: str, request: Request, sessions_api: SessionsApi = Depends()):
    request_payload = await request.json()
    results_access_key = request_payload.get("resultsAccessKey")
    
    if not results_access_key:
        raise HTTPException(status_code=400, detail="Missing resultsAccessKey")
    
    result = sessions_api.get_session_result(session_id, GetSessionResultRequest(results_access_key=results_access_key))
    
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))

@advancedRouter.post("/refresh-content/{session_id}")
async def refresh_content(session_id: str, request: Request, sessions_api: SessionsApi = Depends()):
    request_payload = await request.json()
    results_access_key = request_payload.get("resultsAccessKey")
    
    if not results_access_key:
        raise HTTPException(status_code=400, detail="Missing resultsAccessKey")
    
    result = sessions_api.refresh_step_content(session_id, RefreshStepContentRequest(results_access_key=results_access_key))
    
    return JSONResponse(content=json.loads(json.dumps(result.to_dict(), default=json_serial)))