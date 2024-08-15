import { SessionsApi, Configuration } from "@trinsic/connect-node";
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

//We run with self-signed certificates on localhost :)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const newConfiguration = new Configuration({
  accessToken: process.env.CONNECT_ACCESS_TOKEN!,
});
const api = new SessionsApi(newConfiguration);

app.use(express.json());

app.get("/", express.static(path.join("../web")));
app.use(
  "/dist/connect-web",
  express.static(path.join("../web/dist/connect-web"))
);

app.get("/redirect", (req, res) => {
  //TODO handle redirects
  console.log(req);
  res.redirect("/");
});

app.post("/create-session", async (req, res) => {
  try {
    const result = await api.createSession({
      direct: false,
    });
    console.debug("Created session", result);
    res.send(result);
  } catch (e) {
    console.error(e);
    const body = await e.response.text();
    console.log(body);
  }
});

app.post("/exchange-result", async (req, res) => {
  try {
    const result = await api.exchangeResultsKey({
      sessionId: req.body.sessionId,
      exchangeResultsKeyRequest: {
        resultsAccessKey: req.body.resultsAccessKey,
      },
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
