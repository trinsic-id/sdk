import { CreateWidgetSessionRequest, SessionsApi } from "@trinsic/api";
import path from "path";
import {Express} from "express"

export default function widgetRoutes(app: Express, sessionsApi: SessionsApi) {
    app.get("/widget", (req: any, res: any) => {
        res.sendFile(
            path.join(__dirname, "../../../../ui-web/samples/dist/widget.html")
        );
    });

    app.post("/create-session", async (req: any, res: any) => {
        const request: CreateWidgetSessionRequest = {};
        try {
          const result = await sessionsApi.createWidgetSession(request);
          console.debug("Created session", result);
          res.send(result);
        } catch (e: any) {
          console.error(e);
          const body = await e.response.text();
          console.log(body);
          throw e;
        }
      });
}