import { ResponseError, SessionsApi } from "@trinsic/api";
import path from "path";
import {Express} from "express"

export function advancedRoutes(app: Express, sessionsApi: SessionsApi) {
    app.get("/advanced", (req: any, res: any) => {
        res.sendFile(
            path.join(__dirname, "../../../../ui-web/samples/dist/advanced.html")
        );
    });

    app.get("/advanced-popup", (req: any, res: any) => {
        res.sendFile(
            path.join(__dirname, "../../../../ui-web/samples/dist/advanced-popup.html")
        );
    });

    app.get("/advanced-launch/:provider", async (req: any, res: any) => {
        try {
            const provider = req.params.provider;
            const redirectUrl = req.query.redirectUrl;
            const fallbackToTrinsicUI = req.query.fallbackToTrinsicUI;
            const capabilities = req.query.capabilities.split(",");
    
    
            const result = await sessionsApi.createAdvancedProviderSession({
                provider: provider,
                redirectUrl: redirectUrl,
                capabilities: capabilities,
                fallbackToHostedUI: fallbackToTrinsicUI === "true"
            });
    
            if(result.nextStep.method === "LaunchBrowser") {
                res.redirect(result.nextStep.content);
                return;
            } else {
                const shouldRefresh = result.nextStep.refresh != null
                const refreshAfter = shouldRefresh ? result.nextStep.refresh?.refreshAfter.toISOString() : 0;
                res.redirect(`/advanced-popup?sessionId=${encodeURIComponent(result.sessionId)}&resultsAccessKey=${encodeURIComponent(result.resultCollection.resultsAccessKey ?? "")}&nextStep=${encodeURIComponent(result.nextStep.method)}&content=${encodeURIComponent(result.nextStep.content)}&shouldRefresh=${encodeURIComponent(shouldRefresh)}&refreshAfter=${encodeURIComponent(refreshAfter?? "")}`);
            }
        }
        catch(error: unknown){
            if(error instanceof ResponseError){
                const content = await error.response.text();
                res.redirect(`/advanced-popup?error=${encodeURIComponent(content)}`);
            } else {
                console.error("Unknown error", error);
            }
        }
    });

    app.post('/refresh-content/:sessionId', async (req: any, res: any) => {
        const sessionId = req.params.sessionId;
        const resultsAccessKey = req.body.resultsAccessKey;
        const result = await sessionsApi.refreshStepContent(sessionId, {resultsAccessKey: resultsAccessKey});
        res.json(result);
    });

    app.post("/poll-results/:sessionId", async (req: any, res: any) => {
        const resultsAccessKey = req.body.resultsAccessKey;
        const results = await sessionsApi.getSessionResult(req.params.sessionId, {resultsAccessKey: resultsAccessKey});
        res.json(results);
    });
}