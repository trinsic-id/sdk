from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from trinsic_api.api.sessions_api import SessionsApi, GetSessionResultRequest

sharedRouter = APIRouter()

@sharedRouter.get("/redirect")
async def redirect(request: Request):
    return RedirectResponse(url=f"/redirect.html?{request.query_params}")

@sharedRouter.get("/providers")
async def get_providers():
    try:
        data = network_api.list_providers()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class GetResultsRequest(BaseModel):
    sessionId: str
    resultsAccessKey: str

@sharedRouter.post("/exchange-result")
async def exchange_result(request: GetResultsRequest, sessions_api: SessionsApi = Depends()):
    req = GetSessionResultRequest(resultsAccessKey=request.resultsAccessKey)
    print(req)
    print(request.sessionId)
    data = sessions_api.get_session_result(session_id=request.sessionId, get_session_result_request=req)

    return data