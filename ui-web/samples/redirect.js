import { exchangeResult } from "./shared";

async function completeRedirect() {
  const url = new URL(window.location.href);
  const sessionId = url.searchParams.get("sessionId");
  const tokenKey = `redirectToken:${sessionId}`;
  if (url.searchParams.has("redirectToken")) {
    // Retain the token across reloads until the first successful result request.
    sessionStorage.setItem(tokenKey, url.searchParams.get("redirectToken"));
    url.searchParams.delete("redirectToken");
    history.replaceState(null, "", url);
  }

  if (url.searchParams.get("postRedirectAction") === "poll") {
    const pollUrl = new URL("/direct-poll-after-redirect.html", location.origin);
    pollUrl.searchParams.set("sessionId", sessionId);
    window.location.replace(pollUrl);
    return;
  }

  // Sample only. In production, correlate session credentials on the backend.
  await exchangeResult({
    sessionId,
    resultsAccessKey: sessionStorage.getItem(`resultsAccessKey:${sessionId}`),
    redirectToken: sessionStorage.getItem(tokenKey) ?? undefined
  });
  sessionStorage.removeItem(tokenKey);
}

completeRedirect().catch(error => {
  document.getElementById("result-loading").innerText = error.message;
});
