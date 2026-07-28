import QRCode from "qrcode";
import { jsonHandleError } from "./shared";

async function showDeeplink(url) {
  document.getElementById("qrcode-canvas").style.removeProperty("display");
  await QRCode.toCanvas(document.getElementById("qrcode-canvas"), url);
}

function showContent(content) {
  document.getElementById("show-content").style.removeProperty("display");
  document.getElementById("show-content").innerText = content;
}

function handleNextStep(nextStep, content) {
  if (nextStep === "DeeplinkToMobile") showDeeplink(content);
  if (nextStep === "ShowContent") showContent(content);
}

async function startResultsPolling(sessionId, resultsAccessKey) {
  const resultUrl = `/poll-results/${sessionId}`;
  const resultPollingInterval = setInterval(async () => {
    const result = await fetch(resultUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultsAccessKey })
    }).then(jsonHandleError);

    document.getElementById("done").innerText = result.session.done;
    document.getElementById("success").innerText = result.session.success;
    document.getElementById("error-code").innerText = result.session.errorCode || "N/A";

    if (result.session.done) {
      clearInterval(resultPollingInterval);
      window.location.href = `${location.origin}/redirect?sessionId=${encodeURIComponent(sessionId)}`;
    }
  }, 2000);
}

function startRefreshing(sessionId, nextStep, resultsAccessKey, refreshAfter) {
  const timeout = new Date(refreshAfter).getTime() - Date.now();
  setTimeout(async () => {
    const result = await fetch(`/refresh-content/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultsAccessKey })
    }).then(jsonHandleError);
    handleNextStep(result.nextStep.method, result.nextStep.content);
    document.getElementById("content-refresh").innerText = `Yes, refreshing at ${result.nextStep.refresh.refreshAfter}`;
    startRefreshing(sessionId, result.nextStep.method, resultsAccessKey, result.nextStep.refresh.refreshAfter);
  }, Math.max(0, timeout));
}

function initializeDirectSession() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("sessionId");
  const nextStep = params.get("nextStep");
  const content = params.get("content");
  const shouldRefresh = params.get("shouldRefresh") === "true";
  const refreshAfter = params.get("refreshAfter");
  const resultsAccessKey = localStorage.getItem(`resultsAccessKey:${sessionId}`);

  document.getElementById("session-id").innerText = sessionId;
  document.getElementById("next-step").innerText = nextStep;
  document.getElementById("content-refresh").innerText = shouldRefresh ? `Yes, refreshing at ${refreshAfter}` : "No";
  document.getElementById("polling").innerText = "Yes";
  handleNextStep(nextStep, content);
  startResultsPolling(sessionId, resultsAccessKey);
  if (shouldRefresh) startRefreshing(sessionId, nextStep, resultsAccessKey, refreshAfter);
}

initializeDirectSession();
