import {
  SessionsApi,
  Configuration,
  NetworkApi,
} from "@trinsic/api";
import { sharedRoutes } from "./shared";
import { widgetRoutes } from "./widget";
import { hostedRoutes } from "./hosted";
import path from "path";
import express from "express";
import { advancedRoutes } from "./advanced";
import 'express-async-errors';
import { handleErrors } from "./handleErrors";

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
advancedRoutes(app, sessionsApi);

// Serve web SDK
app.use(
  "/assets",
  express.static(path.join("../../../ui-web/samples/dist/assets"))
);

handleErrors(app);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
