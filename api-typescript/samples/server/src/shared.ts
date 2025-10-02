import { NetworkApi, SessionsApi } from "@trinsic/api";
const path = require("path");
import { Express } from "express";
import express from "express";

export function sharedRoutes(
  app: Express,
  networkApi: NetworkApi,
  sessionsApi: SessionsApi
) {
  app.get("/", express.static(path.join("../../../ui-web/samples/dist")));
  app.get("/redirect", (req: any, res: any) => {
    res.sendFile(
      path.join(__dirname, "../../../../ui-web/samples/dist/redirect.html")
    );
  });

  app.get("/providers", async (req: any, res: any) => {
    const ipAddress = req.query.ipAddress;
    const result = await networkApi.recommendProviders({
      verificationProfileId: process.env.TRINSIC_VERIFICATION_PROFILE_ID!,
      recommendationInfo: {
        ipAddresses: [ipAddress],
      },
    });
    res.send(result);
  });

  app.post("/exchange-result", async (req: any, res: any) => {
    const result = await sessionsApi.getSessionResult(req.body.sessionId, {
      resultsAccessKey: req.body.resultsAccessKey,
    });
    res.send(result);
  });
}
