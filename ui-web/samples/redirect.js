(() => {
  // Parse out the query parameters from the URL
  const params = new URLSearchParams(window.location.search);
  const postRedirectAction = params.get("postRedirectAction");
  const sessionId = params.get("sessionId");

  // Fetch resultsAccessKey from localStorage, which was stored there when we created the Session.
  // NOTE: Do not do this in production. resultsAccessKey should be stored securely in your backend, correlated with your user's session.
  const resultsAccessKey = localStorage.getItem(`resultsAccessKey:${sessionId}`);

  // (Direct Sessions Only) If postRedirectAction is "poll", the results of the Session are not immediately available, so we need to poll for them
  // (related to `PollAfterRedirect` capability)
  if (postRedirectAction === "poll") {
    const pollUrl = window.location.origin + "/direct-poll-after-redirect?sessionId=" + sessionId;
    window.location.href = pollUrl;
    return;
  }

  // Otherwise, results are immediately available to fetch from Trinsic's API.
  exchangeResult({ resultsAccessKey, sessionId });
})();
