import QRCode from 'qrcode'
import MicroModal from "micromodal";
import { jsonHandleError } from './shared';
MicroModal.init();

window.exchangeResult = exchangeResult;

async function showDeeplink(url) {
  document.getElementById("qrcode-canvas").style.removeProperty("display");
  await QRCode.toCanvas(document.getElementById('qrcode-canvas'), url);
}

function showContent(content) {
  document.getElementById("show-content").style.removeProperty("display");
  document.getElementById("show-content").innerText = content;
}

function handleNextStep(nextStep, content) {
  console.log("Next step: ", nextStep);
  if (nextStep === "DeeplinkToMobile") {
    showDeeplink(content);
  }

  if (nextStep === "ShowContent") {
    showContent(content);
  }
}

async function startResultsPolling(sessionId, resultsAccessKey) {
  let result = null;
  let resultUrl = `/poll-results/${sessionId}`;
  let resultPollingInterval = setInterval(async () => {
    result = await fetch(resultUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resultsAccessKey: resultsAccessKey
      })
    })
    .then(r => jsonHandleError(r))
      .then((r) => r);
    document.getElementById("done").innerText = result.session.done;
    document.getElementById("success").innerText = result.session.success;
    document.getElementById("error-code").innerText = result.session.errorCode || "N/A";

    if (result.session.done === true) {
      clearInterval(resultPollingInterval);

      const data = {
        success: result.session.success,
        resultsAccessKey: resultsAccessKey,
        sessionId: sessionId,
        isTrinsicSamplePopupMessage: true,
      };

      console.debug("Sending message to opener", data, window.opener);
      window.opener?.postMessage(data, "*");
    }
  }, 2000);
}

async function initializeAdvancedPopup() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sessionId = urlSearchParams.get('sessionId');
  const resultsAccessKey = urlSearchParams.get('resultsAccessKey');
  const nextStep = urlSearchParams.get('nextStep');
  const content = urlSearchParams.get('content');
  const shouldRefresh = urlSearchParams.get('shouldRefresh') === 'true';
  const refreshAfter = urlSearchParams.get('refreshAfter');
  document.getElementById("session-id").innerText = sessionId;
  document.getElementById("next-step").innerText = nextStep;
  document.getElementById("content-refresh").innerText = shouldRefresh ? "Yes, refreshing at " + refreshAfter : "No";
  document.getElementById("polling").innerText = "Yes";

  handleNextStep(nextStep, content);

  // Since we are not redirected elsewhere, the only other method of getting the results is via polling.
  startResultsPolling(sessionId, resultsAccessKey);

  // Some integrations require their content to be refreshed.
  if (shouldRefresh) {
    startRefreshing(sessionId, nextStep, resultsAccessKey, refreshAfter);
  }
}

async function startRefreshing(sessionId, nextStep, resultsAccessKey, refreshAfter) {
  const timeout = new Date(refreshAfter) - new Date();

  console.log("Refreshing in ", timeout);
  setTimeout(async () => {
    console.log("Refreshing");
    const result = await fetch("refresh-content/" + sessionId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        resultsAccessKey: resultsAccessKey
      })
    }).then(r => jsonHandleError(r));
    handleNextStep(result.nextStep.method, result.nextStep.content);
    document.getElementById("content-refresh").innerText = "Yes, refreshing at " + result.nextStep.refresh.refreshAfter;
    startRefreshing(sessionId, result.nextStep.method, resultsAccessKey, result.nextStep.refresh.refreshAfter);
  }, timeout);
}

initializeAdvancedPopup();