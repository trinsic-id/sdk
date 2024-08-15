import { SessionsApi, Configuration } from "@trinsic/connect-node";
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", express.static(path.join("../web")));
app.use(
  "/dist/connect-web",
  express.static(path.join("../web/dist/connect-web"))
);

app.post("/create-session", async (req, res) => {
  const api = new SessionsApi({
    accessToken:
      "CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEkkKK3Vybjp0cmluc2ljOndhbGxldHM6ek54N002VDJDTXR4aFJCTVRMdkpQa2giGnVybjp0cmluc2ljOmVjb3N5c3RlbXM6aWR2GjCGzYbVGZOTybfa6HFxi3MwrWSvDWyqjuctixuQ73oSfJshsRMcTt+sEVzouJntGJUiAA==",
  });
  try {
    const result = await api.createSession({
      createSessionRequest: {
        direct: false,
      },
    });
    res.send(result);
  } catch (e) {
    const body = await e.response.text();
    console.log(body);
  }
});

app.post("/exchange-result", async (req, res) => {
  const newConfiguration = new Configuration({
    accessToken:
      "CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEkkKK3Vybjp0cmluc2ljOndhbGxldHM6ek54N002VDJDTXR4aFJCTVRMdkpQa2giGnVybjp0cmluc2ljOmVjb3N5c3RlbXM6aWR2GjCGzYbVGZOTybfa6HFxi3MwrWSvDWyqjuctixuQ73oSfJshsRMcTt+sEVzouJntGJUiAA==",
  });
  const api = new SessionsApi(newConfiguration);
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
