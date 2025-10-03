from dotenv import load_dotenv

load_dotenv()
from pathlib import Path
from static_file_middleware import StaticFileMiddleware

import os
import pathlib
from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from shared import sharedRouter
from widget import widgetRouter
from hosted import hostedRouter
from direct import directRouter
from trinsic_api.exceptions import ApiException
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

app = FastAPI()

app.include_router(sharedRouter, dependencies=[Depends(get_sessions_api)])
app.include_router(widgetRouter, dependencies=[Depends(get_sessions_api)])
app.include_router(hostedRouter, dependencies=[Depends(get_sessions_api)])
app.include_router(directRouter, dependencies=[Depends(get_sessions_api)])

# Absolute path to our static files
static_dir = Path(__file__).parent.parent.parent.parent / "ui-web" / "samples" / "dist"
print(f"Serving static files from {static_dir}")

app.add_middleware(StaticFileMiddleware, static_dir=str(static_dir))

# === Error Handlers ===

@app.exception_handler(ApiException)
async def trinsic_api_exception_handler(request: Request, exc: ApiException):
    print(f"[Trinsic API error] {exc}")

    return JSONResponse(
        status_code=exc.status_code if hasattr(exc, "status_code") else 500,
        content={
            "message": "Request failed: check logs for details.",
            "error": str(exc)
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    print(f"[Unhandled exception] {exc}")

    return JSONResponse(
        status_code=500,
        content={
            "message": "An unexpected error occurred.",
            "error": str(exc)
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=3000)
