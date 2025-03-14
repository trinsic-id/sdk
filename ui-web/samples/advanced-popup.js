import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";
import QRCode from 'qrcode'
import MicroModal from "micromodal";
MicroModal.init();

window.exchangeResult = exchangeResult;

async function showDeeplink(url){
  await QRCode.toCanvas(document.getElementById('qrcode-canvas'), url);
}

async function startResultsPolling(sessionId, resultsAccessKey){
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
      .then((response) => response.json())
      .then((r) => r);
    document.getElementById("done").innerText = result.Session.Done;
    document.getElementById("success").innerText = result.Session.Success;
    document.getElementById("error-code").innerText = result.Session.ErrorCode || "N/A";

    if(result.Session.Done === true){
      clearInterval(resultPollingInterval);
      const data = {
        success: result.Session.Success,
        resultsAccessKey: resultsAccessKey,
        sessionId: sessionId,
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
  const shouldRefresh = urlSearchParams.get('shouldRefresh') === 'True';
  const refreshAfter = urlSearchParams.get('refreshAfter');
  const error = urlSearchParams.get('error');
  if(error) {
    const decoded = decodeURIComponent(error);
    const parsedError = JSON.parse(decoded);
    let errorContent = `${parsedError.title}<br/> 
        <b>Trace id: ${parsedError.traceId}</b><br/>`;
    if(parsedError.errors) {
        errorContent += "<ul style=\"margin-top: 30px\">";
        //errors is an object with keys and values, iterate over the keys and values
        Object.keys(parsedError.errors).forEach(key => {
            errorContent += `<li>${key}: ${parsedError.errors[key]}</li>`;
        });
        errorContent += "</ul>";
    }
    document.getElementById("advanced-modal-content").innerHTML = errorContent;
    return;
  }
  console.log(content);
  document.getElementById("session-id").innerText = sessionId;
  document.getElementById("next-step").innerText = nextStep;
  document.getElementById("content-refresh").innerText = shouldRefresh ? "Yes, refreshing at " + refreshAfter : "No";
  document.getElementById("polling").innerText = "Yes";
  if(nextStep === "DeeplinkToMobile") {
    showDeeplink(content);
  }
  startResultsPolling(sessionId, resultsAccessKey);
  if(shouldRefresh) {
    startRefreshing(sessionId, resultsAccessKey, refreshAfter);
  }
}

async function startRefreshing(sessionId, resultsAccessKey, refreshAfter) {
  console.log(new Date(refreshAfter))
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
    }).then(r => r.json());
    showDeeplink(result.nextStep.content);
    document.getElementById("content-refresh").innerText = "Yes, refreshing at " + result.nextStep.refresh.refreshAfter;
    startRefreshing(sessionId, resultsAccessKey, result.nextStep.refresh.refreshAfter);
  }, timeout);
}
function showResult(resultJson) {
  document.getElementById("results").innerText = JSON.stringify(resultJson, null, 2);
  MicroModal.show('results-modal');
}

initializeAdvancedPopup();