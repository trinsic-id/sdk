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