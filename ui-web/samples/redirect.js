import { exchangeResult } from "./shared";

const params = new URLSearchParams(window.location.search);
const sessionId = params.get("sessionId");
const redirectToken = params.get("redirectToken") ?? undefined;

// Sample only. In production, correlate session credentials on the backend.
const resultsAccessKey = localStorage.getItem(`resultsAccessKey:${sessionId}`);
if (params.get("postRedirectAction") === "poll") {
  if (redirectToken) {
    sessionStorage.setItem(`redirectToken:${sessionId}`, redirectToken);
  }
  const pollUrl = new URL("/direct-poll-after-redirect.html", location.origin);
  pollUrl.searchParams.set("sessionId", sessionId);
  window.location.replace(pollUrl);
} else {
  exchangeResult({ resultsAccessKey, sessionId, redirectToken });
}
