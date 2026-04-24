from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from trinsic_api.api.sessions_api import SessionsApi, GetSessionResultRequest
from trinsic_api.models import RecommendationInfo, RecommendProvidersRequest
import os
sharedRouter = APIRouter()

@sharedRouter.get("/redirect")
async def redirect(request: Request):
    return RedirectResponse(url=f"/redirect.html?{request.query_params}")

@sharedRouter.get("/providers")
async def get_providers(request: Request, sessions_api: SessionsApi = Depends()):
    ip_address = request.query_params.get("ipAddress")  # Get query param
    ip_addresses = [ip_address] if ip_address else []
    req = RecommendProvidersRequest(recommendation_info=RecommendationInfo(ip_addresses=ip_addresses), verification_profile_id=os.getenv("TRINSIC_VERIFICATION_PROFILE_ID"))
    data = sessions_api.recommend_providers(req)
    return data

class GetResultsRequest(BaseModel):
    sessionId: str
    resultsAccessKey: str

@sharedRouter.post("/exchange-result")
async def exchange_result(request: GetResultsRequest, sessions_api: SessionsApi = Depends()):
    req = GetSessionResultRequest(resultsAccessKey=request.resultsAccessKey)
    data = sessions_api.get_session_result(session_id=request.sessionId, get_session_result_request=req)

    return data