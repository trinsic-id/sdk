import {
  SessionsApi,
  Configuration,
  CreateSessionRequest,
  NetworkApi,
} from "@trinsic/api";
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

//We run with self-signed certificates on localhost :)
const newConfiguration = new Configuration({
  accessToken: process.env.TRINSIC_ACCESS_TOKEN!,
});
const sessionsApi = new SessionsApi(newConfiguration);
const networkApi = new NetworkApi(newConfiguration);

app.use(express.json());

app.get("/", express.static(path.join("../../../ui-web/samples/dist")));
app.get("/redirect", (req: any, res: any) => {
  res.sendFile(
    path.join(__dirname, "../../../../ui-web/samples/dist/redirect.html")
  );
});

app.use(
  "/assets",
  express.static(path.join("../../../ui-web/samples/dist/assets"))
);

app.get("/providers", async (req: any, res: any) => {
  const result = await networkApi.listProviders();
  res.send(result);
});

app.get("/launch/:providerId", async (req: any, res: any) => {
  const request: CreateSessionRequest = {
    launchProviderDirectly: true,
    providers: [req.params.providerId],
  };
  const result = await createSession(request);
  res.redirect(result.launchUrl + "&redirectUrl=" + req.query.redirectUrl);
});

app.post("/create-session", async (req: any, res: any) => {
  const request: CreateSessionRequest = {};
  const result = await createSession(request);
  res.send(result);
});

async function createSession(request: CreateSessionRequest) {
  console.log("Creating session", request);

  try {
    const result = await sessionsApi.createSession(request);
    console.debug("Created session", result);
    return result;
  } catch (e: any) {
    console.error(e);
    const body = await e.response.text();
    console.log(body);
    throw e;
  }
}

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
