import QRCode from 'qrcode'
import MicroModal from "micromodal";
import { jsonHandleError } from './shared';

window.exchangeResult = exchangeResult;

async function startPollingAfterRedirect(sessionId, resultsAccessKey) {
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

    document.getElementById("last-polled").innerText = new Date().toLocaleTimeString();
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
  }, 1000);
}

async function initializePollAfterRedirect() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sessionId = urlSearchParams.get('sessionId');
  const resultsAccessKey = urlSearchParams.get('resultsAccessKey');

  document.getElementById("session-id").innerText = sessionId;
  document.getElementById("success").innerText = "false";
  document.getElementById("done").innerText = "false";
  document.getElementById("last-polled").innerText = new Date().toLocaleTimeString();

  startPollingAfterRedirect(sessionId, resultsAccessKey);
}

initializePollAfterRedirect();