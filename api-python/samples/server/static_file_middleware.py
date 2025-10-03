from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import FileResponse
from pathlib import Path
import mimetypes
import logging

logger = logging.getLogger("uvicorn.error")

class StaticFileMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, static_dir: str):
        super().__init__(app)
        self.static_dir = Path(static_dir).resolve()

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Default to index.html on root
        if path == "/":
            path = "/index.html"

        # Resolve file path and ensure it's inside static_dir (security)
        file_path = (self.static_dir / path.lstrip("/")).resolve()

        # Prevent directory traversal (e.g. ../)
        if not str(file_path).startswith(str(self.static_dir)):
            logger.warning(f"[StaticFileMiddleware] Blocked suspicious path: {file_path}")
            return await call_next(request)

        if file_path.is_file():
            logger.info(f"[StaticFileMiddleware] Serving file: {file_path}")
            # Let Starlette handle streaming & content-type
            mime_type, _ = mimetypes.guess_type(str(file_path))
            return FileResponse(file_path, media_type=mime_type or "application/octet-stream")

        # Try fallback to .html (e.g. /foo -> /foo.html)
        fallback_path = file_path.with_suffix(".html")
        if fallback_path.is_file():
            logger.info(f"[StaticFileMiddleware] Serving HTML fallback: {fallback_path}")
            mime_type, _ = mimetypes.guess_type(str(fallback_path))
            return FileResponse(fallback_path, media_type=mime_type or "text/html")

        # If no static file found, continue processing request
        return await call_next(request)