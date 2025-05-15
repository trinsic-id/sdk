import 'express-async-errors'; // 👈 this must come before your routes
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
import { Request, Response, NextFunction } from "express";
import { advancedRoutes } from "./advanced";


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


app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err?.response?.body) {
      const content = await err.response.text();
      console.error(`Request failed with status ${err.response.status}: ${content}`);
    }
    else {
      console.error(err);
    }
  }
  catch (e) {
    console.error("Error reading error response", e);
  }
  res.status(err.statusCode || 500).json({ message: `Request failed: check the logs on the backend for more information. ${err.message}` || 'Request failed: check the logs on the backend for more information.' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
