from fastapi import Request, APIRouter, Depends, HTTPException
from pydantic import BaseModel
from trinsic_api.api.sessions_api import SessionsApi, CreateWidgetSessionRequest
from fastapi.responses import RedirectResponse

widgetRouter = APIRouter()

@widgetRouter.get("/widget")
async def redirect():
    return RedirectResponse(url="/widget.html")

@widgetRouter.post("/create-session")
async def create_session(request: Request, sessions_api: SessionsApi = Depends()):
    redirect_url = request.query_params.get("redirectUrl")  # Get query param
    request = CreateWidgetSessionRequest()
    request.redirect_url = redirect_url
    data = sessions_api.create_widget_session(create_widget_session_request=request)
    return data