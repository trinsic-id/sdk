import {
  SessionsApi,
  Configuration,
  NetworkApi,
  CreateWidgetSessionRequest,
} from "@trinsic/api";
import sharedRoutes from "./shared";
import widgetRoutes from "./widget";
import hostedRoutes from "./hosted";
import path from "path";
import express from "express";

const app = express();
const PORT = 3000;

//We run with self-signed certificates on localhost :)
const newConfiguration = new Configuration({
  accessToken: process.env.TRINSIC_ACCESS_TOKEN!,
});
const sessionsApi = new SessionsApi(newConfiguration);
const networkApi = new NetworkApi(newConfiguration);

app.use(express.json());

sharedRoutes(app, networkApi, sessionsApi)
widgetRoutes(app, sessionsApi);
hostedRoutes(app, sessionsApi);

// Serve web SDK
app.use(
  "/assets",
  express.static(path.join("../../../ui-web/samples/dist/assets"))
);



// app.get("/launch/:providerId", async (req: any, res: any) => {
//   const request: CreateSessionRequest = {
//     launchProviderDirectly: true,
//     providers: [req.params.providerId],
//   };
//   const result = await createSession(request);
//   res.redirect(result.launchUrl + "&redirectUrl=" + req.query.redirectUrl);
// });


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
