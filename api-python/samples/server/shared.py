from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from trinsic_api.api.sessions_api import SessionsApi, GetSessionResultRequest
from trinsic_api.api.network_api import NetworkApi, RecommendRequest
from trinsic_api.models import RecommendationInfo

sharedRouter = APIRouter()

@sharedRouter.get("/redirect")
async def redirect(request: Request):
    return RedirectResponse(url=f"/redirect.html?{request.query_params}")

@sharedRouter.get("/providers")
async def get_providers(request: Request, network_api: NetworkApi = Depends()):
    ip_address = request.query_params.get("ipAddress")  # Get query param
    req = RecommendRequest(recommendation_info=RecommendationInfo(ip_addresses=[ip_address]))
    data = network_api.recommend_providers(req)
    return data

class GetResultsRequest(BaseModel):
    sessionId: str
    resultsAccessKey: str

@sharedRouter.post("/exchange-result")
async def exchange_result(request: GetResultsRequest, sessions_api: SessionsApi = Depends()):
    req = GetSessionResultRequest(resultsAccessKey=request.resultsAccessKey)
    data = sessions_api.get_session_result(session_id=request.sessionId, get_session_result_request=req)

    return data