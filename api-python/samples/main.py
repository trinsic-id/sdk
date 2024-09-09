from dotenv import load_dotenv
load_dotenv()

import os
import pathlib
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from trinsic_api.api_client import ApiClient
from trinsic_api.api.network_api import NetworkApi
from trinsic_api.api.sessions_api import SessionsApi
from trinsic_api.models.create_session_request import CreateSessionRequest
from trinsic_api.models.get_session_result_request import GetSessionResultRequest

token = os.getenv("TRINSIC_ACCESS_TOKEN") or ""
auth_token = "Bearer " + token
api_client = ApiClient(configuration=None, header_name="Authorization", header_value=auth_token)

app = FastAPI()

network_api = NetworkApi(api_client)
sessions_api = SessionsApi(api_client)

web_ui_path = pathlib.Path(__file__).parent / "../../ui-web/samples/dist"

@app.get("/redirect")
async def redirect():
    return RedirectResponse(url="/redirect.html")

@app.get("/providers")
async def get_providers():
    try:
        data = network_api.list_providers()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/launch/{provider_id}")
async def launch(provider_id: str, redirectUrl: str):
    try:
        request = CreateSessionRequest()
        request.providers = [provider_id]
        request.launch_provider_directly = True

        data = sessions_api.create_session(create_session_request=request)

        if (data.launch_url is None):
            raise Exception("No launch URL returned from Trinsic API")
        
        launch_url = data.launch_url + "&redirectUrl=" + redirectUrl if redirectUrl else data.launch_url
        return RedirectResponse(url=launch_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/create-session")
async def create_session():
    try:
        request = CreateSessionRequest()
        data = sessions_api.create_session(create_session_request=request)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class GetResultsRequest(BaseModel):
    sessionId: str
    resultsAccessKey: str

@app.post("/exchange-result")
async def exchange_result(request: GetResultsRequest):
    try:
        req = GetSessionResultRequest(resultsAccessKey=request.resultsAccessKey)
        data = sessions_api.get_session_result(session_id=request.sessionId, get_session_result_request=req)

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
app.mount("/", StaticFiles(directory=web_ui_path, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8080)
