import { signalRedirectFromPopup } from "@trinsic/web-ui";
import MicroModal from "micromodal";

(() => {
  // Parse out the query parameters from the URL
  const params = new URLSearchParams(window.location.search);
  const postRedirectAction = params.get("postRedirectAction");
  const sessionId = params.get("sessionId");
  const redirectToken = params.get("redirectToken");

  // Keep the token available to the opener and the poll-after-redirect page.
  // Like resultsAccessKey below, this uses localStorage for the sample only;
  // production applications should keep session credentials on their backend.
  if (redirectToken) {
    localStorage.setItem(`redirectToken:${sessionId}`, redirectToken);
  }

  // Fetch resultsAccessKey from localStorage, which was stored there when we created the Session.
  // NOTE: Do not do this in production. resultsAccessKey should be stored securely in your backend, correlated with your user's session.
  const resultsAccessKey = localStorage.getItem(`resultsAccessKey:${sessionId}`);

  // (Direct Sessions Only) If postRedirectAction is "poll", the results of the Session are not immediately available, so we need to poll for them
  // (related to `PollAfterRedirect` capability)
  if (postRedirectAction === "poll") {
    const pollUrl = new URL("/direct-poll-after-redirect", window.location.origin);
    pollUrl.searchParams.set("sessionId", sessionId);
    pollUrl.searchParams.set("resultsAccessKey", resultsAccessKey);
    window.location.href = pollUrl.toString();
    return;
  }

  // Otherwise, results are immediately available to fetch from Trinsic's API, so we should proceed.

  // If this page was opened in a popup, signal the opener window
  // Otherwise, if it's a top-level redirect, we should exchange results directly
  if (window.opener) {
    signalRedirectFromPopup({
      sessionId,
      closeWindowAfterSignal: true
    });
  } else {
    exchangeResult({ resultsAccessKey, sessionId, redirectToken });
  }
})();
