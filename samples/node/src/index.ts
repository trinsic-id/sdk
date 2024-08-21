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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const newConfiguration = new Configuration({
  accessToken: process.env.TRINSIC_ACCESS_TOKEN!,
});
const sessionsApi = new SessionsApi(newConfiguration);
const networkApi = new NetworkApi(newConfiguration);

app.use(express.json());

app.get("/", express.static(path.join("../web-ui")));
app.get("/redirect", (req, res) => {
  res.sendFile(path.join(__dirname, "../../web-ui/redirect.html"));
});

app.use("/dist/web-ui", express.static(path.join("../web/dist/web-ui")));

app.get("/providers", async (req, res) => {
  const result = await networkApi.listProviders();
  res.send(result);
});

app.get("/launch/:providerId", async (req, res) => {
  const request: CreateSessionRequest = {
    launchMethodDirectly: true,
    providers: [req.params.providerId],
  };
  const result = await createSession(request);
  res.redirect(result.launchUrl + "&redirectUrl=" + req.query.redirectUrl);
});

app.post("/create-session", async (req, res) => {
  const request: CreateSessionRequest = {};
  const result = createSession(request);
  res.send(result);
});

async function createSession(request: CreateSessionRequest) {
  console.log("Creating session", request);

  try {
    const result = await sessionsApi.createSession(request);
    console.debug("Created session", result);
    return result;
  } catch (e) {
    console.error(e);
    const body = await e.response.text();
    console.log(body);
    throw e;
  }
}

app.post("/exchange-result", async (req, res) => {
  try {
    const result = await sessionsApi.exchangeResultsKey(req.body.sessionId, {
      resultsAccessKey: req.body.resultsAccessKey,
    });
    res.send(result);
  } catch (e) {
    console.error(e);
    const body = await e.response.text();
    console.log(body);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
