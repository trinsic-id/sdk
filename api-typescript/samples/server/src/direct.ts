import { ResponseError, SessionsApi } from "@trinsic/api";
import path from "path";
import { Express } from "express";

export function directRoutes(app: Express, sessionsApi: SessionsApi) {
  app.get("/direct", (req: any, res: any) => {
    res.sendFile(
      path.join(__dirname, "../../../../ui-web/samples/dist/direct.html")
    );
  });

  app.get("/direct-popup", (req: any, res: any) => {
    res.sendFile(
      path.join(__dirname, "../../../../ui-web/samples/dist/direct-popup.html")
    );
  });

  app.post("/create-direct-session/:provider", async (req: any, res: any) => {
    const provider = req.params.provider;
    const redirectUrl = req.query.redirectUrl;
    const fallbackToTrinsicUI = req.query.fallbackToTrinsicUI;
    const capabilities = req.query.capabilities.split(",");

    const result = await sessionsApi.createDirectProviderSession({
      verificationProfileId: process.env.TRINSIC_VERIFICATION_PROFILE_ID!,
      provider: provider,
      redirectUrl: redirectUrl,
      capabilities: capabilities,
      fallbackToHostedUI: fallbackToTrinsicUI === "true",
    });

    res.json(result);
  });

  app.post("/refresh-content/:sessionId", async (req: any, res: any) => {
    const sessionId = req.params.sessionId;
    const resultsAccessKey = req.body.resultsAccessKey;
    const result = await sessionsApi.refreshStepContent(sessionId, {
      resultsAccessKey: resultsAccessKey,
    });
    res.json(result);
  });

  app.post("/poll-results/:sessionId", async (req: any, res: any) => {
    const resultsAccessKey = req.body.resultsAccessKey;
    const results = await sessionsApi.getSessionResult(req.params.sessionId, {
      resultsAccessKey: resultsAccessKey,
    });
    res.json(results);
  });
}
