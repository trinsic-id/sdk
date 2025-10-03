import { NetworkApi, SessionsApi } from "@trinsic/api";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
// Middleware to serve files if they exist
function serveStaticFileIfExists(staticDir: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    let requestPath = req.path;
    if (req.path === "/") {
      requestPath = "/index.html"; // default to index.html
    }
    const filePath = path.join(staticDir, requestPath);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        res.sendFile(filePath);
      } else {
        fs.stat(path.join(staticDir, requestPath + ".html"), (err, stats) => {
          if (!err && stats.isFile()) {
            res.sendFile(path.join(staticDir, requestPath + ".html"));
          } else {
            next();
          }
        });
      }
    });
  };
}

export function sharedRoutes(
  app: Express,
  networkApi: NetworkApi,
  sessionsApi: SessionsApi
) {
  // Use the middleware for a specific base path
  app.use(
    "/",
    serveStaticFileIfExists(
      path.join(__dirname, "../../../../ui-web/samples/dist")
    )
  );

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
