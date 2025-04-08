from dotenv import load_dotenv
load_dotenv()

import os
import pathlib
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from shared import sharedRouter
from widget import widgetRouter
from hosted import hostedRouter
from advanced import advancedRouter
from trinsic_api.configuration import Configuration
from trinsic_api.api_client import ApiClient
from trinsic_api.api.network_api import NetworkApi
from trinsic_api.api.sessions_api import SessionsApi

token = os.getenv("TRINSIC_ACCESS_TOKEN") or ""
auth_token = "Bearer " + token
configuration = Configuration.get_default()
# Set to true if you want debug request logging
configuration.debug = False
configuration.access_token = token

api_client = ApiClient(configuration=configuration)

network_api = NetworkApi(api_client)
sessions_api = SessionsApi(api_client)

def get_sessions_api():
    return sessions_api
def get_network_api():
    return network_api

web_ui_path = pathlib.Path(__file__).parent / "../../../ui-web/samples/dist"

app = FastAPI()

app.include_router(sharedRouter, dependencies=[Depends(get_sessions_api)])
app.include_router(widgetRouter, dependencies=[Depends(get_sessions_api)])
app.include_router(hostedRouter, dependencies=[Depends(get_sessions_api)])
app.include_router(advancedRouter, dependencies=[Depends(get_sessions_api)])

app.mount("/", StaticFiles(directory=web_ui_path, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=3000)
