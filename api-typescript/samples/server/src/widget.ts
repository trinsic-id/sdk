import { CreateWidgetSessionRequest, SessionsApi } from "@trinsic/api";
import path from "path";
import { Express } from "express"

export function widgetRoutes(app: Express, sessionsApi: SessionsApi) {
  app.get("/widget", (req: any, res: any) => {
    res.sendFile(
      path.join(__dirname, "../../../../ui-web/samples/dist/widget.html")
    );
  });

  app.post("/create-session", async (req: any, res: any) => {
    const redirectUrl = req.query.redirectUrl;
    const result = await sessionsApi.createWidgetSession({ redirectUrl:  redirectUrl });
    console.debug("Created session", result);
    res.send(result);
  });
}