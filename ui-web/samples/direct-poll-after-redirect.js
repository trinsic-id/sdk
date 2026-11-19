import { jsonHandleError } from './shared';

async function startPollingAfterRedirect(sessionId, resultsAccessKey) {
  const tokenKey = `redirectToken:${sessionId}`;
  async function poll() {
    const result = await fetch(`/poll-results/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultsAccessKey, redirectToken: sessionStorage.getItem(tokenKey) ?? undefined })
    }).then(jsonHandleError);

    // The first successful poll validates the one-time redirect token.
    sessionStorage.removeItem(tokenKey);
    document.getElementById("last-polled").innerText = new Date().toLocaleTimeString();
    document.getElementById("done").innerText = result.session.done;
    document.getElementById("success").innerText = result.session.success;
    document.getElementById("error-code").innerText = result.session.errorCode || "N/A";

    if (result.session.done === true) {
      window.location.href = `${location.origin}/redirect?sessionId=${encodeURIComponent(sessionId)}`;
      return;
    }
    setTimeout(poll, 1000);
  }
  await poll();
}

async function initializePollAfterRedirect() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sessionId = urlSearchParams.get('sessionId');
  const resultsAccessKey = localStorage.getItem(`resultsAccessKey:${sessionId}`);

  document.getElementById("session-id").innerText = sessionId;
  document.getElementById("success").innerText = "false";
  document.getElementById("done").innerText = "false";
  document.getElementById("last-polled").innerText = new Date().toLocaleTimeString();

  startPollingAfterRedirect(sessionId, resultsAccessKey);
}

initializePollAfterRedirect();
