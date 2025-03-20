import { NetworkApi, SessionsApi } from "@trinsic/api";
const path = require("path");
import {Express} from "express"
import express from "express";

export default function sharedRoutes(app: Express, networkApi: NetworkApi, sessionsApi: SessionsApi) {
    app.get("/", express.static(path.join("../../../ui-web/samples/dist")));
    app.get("/redirect", (req: any, res: any) => {
        res.sendFile(
            path.join(__dirname, "../../../../ui-web/samples/dist/redirect.html")
        );
    });

    app.get("/providers", async (req: any, res: any) => {
        const ipAddress = req.query.ipAddress;
        const result = await networkApi.recommendProviders({
            ipAddresses: [ipAddress]
        });
        res.send(result);
    });

    app.post("/exchange-result", async (req: any, res: any) => {
        try {
          const result = await sessionsApi.getSessionResult(req.body.sessionId, {
            resultsAccessKey: req.body.resultsAccessKey,
          });
          res.send(result);
        } catch (e: any) {
          console.error(e);
          const body = await e.response.text();
          console.log(body);
        }
      });
}

