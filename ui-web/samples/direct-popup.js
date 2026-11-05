import QRCode from 'qrcode'
import MicroModal from "micromodal";
import { signalRedirectFromPopup } from '@trinsic/web-ui';
import { catchErrorAlert } from './shared';
MicroModal.init();

async function showDeeplink(url) {
  document.getElementById("qrcode-canvas").style.removeProperty("display");
  await QRCode.toCanvas(document.getElementById('qrcode-canvas'), url);
}

function showContent(content) {
  document.getElementById("show-content").style.removeProperty("display");
  document.getElementById("show-content").innerText = content;
}

async function handleNextStep(nextStep, content) {
  console.log("Next step: ", nextStep);
  document.getElementById("next-step").innerText = nextStep;
  if (nextStep === "DeeplinkToMobile") {
    await showDeeplink(content);
  }

  if (nextStep === "ShowContent") {
    showContent(content);
  }
}

function startSessionUpdates(sessionId, resultsAccessKey, initialRefreshAfter) {
  let timer;
  let stopped = false;
  let refreshAt = null;
  const controller = new AbortController();

  function setRefreshAfter(refreshAfter) {
    refreshAt = refreshAfter == null ? null : Date.parse(refreshAfter);
    if (refreshAt !== null && !Number.isFinite(refreshAt)) {
      throw new Error("The session returned an invalid content refresh time.");
    }
    document.getElementById("content-refresh").innerText = refreshAt === null
      ? "No" : "Yes, refreshing at " + refreshAfter;
  }

  function stop() {
    stopped = true;
    clearTimeout(timer);
    controller.abort();
    window.removeEventListener("pagehide", stop);
    document.getElementById("polling").innerText = "No";
    document.getElementById("content-refresh").innerText = "No";
  }

  function post(url) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resultsAccessKey }),
      signal: controller.signal
    });
  }

  async function readJson(response) {
    if (!response.ok) {
      throw new Error(`Request failed (HTTP ${response.status}): check the logs on the backend for more information.\nUrl: ${response.url}`);
    }
    return response.json();
  }

  async function pollResults() {
    const result = await readJson(await post(`/poll-results/${sessionId}`));
    if (stopped) return true;
    document.getElementById("done").innerText = result.session.done;
    document.getElementById("success").innerText = result.session.success;
    document.getElementById("error-code").innerText = result.session.errorCode || "N/A";

    if (result.session.done === true) {
      stop();
      signalRedirectFromPopup({
        sessionId,
        closeWindowAfterSignal: true
      });
      return true;
    }
    return false;
  }

  async function update() {
    if (stopped) return;
    try {
      // Poll and refresh sequentially so a completed session never leaves a
      // separate refresh timer running. Check status before each refresh.
      if (await pollResults()) return;

      if (refreshAt !== null && Date.now() >= refreshAt) {
        const response = await post(`/refresh-content/${sessionId}`);
        if (stopped) return;

        // Completion can still race with an in-flight refresh. Only treat a
        // rejected refresh as completion if a fresh result confirms it.
        if (response.status === 400 && await pollResults()) return;

        const result = await readJson(response);
        if (stopped) return;
        await handleNextStep(result.nextStep.method, result.nextStep.content);
        if (stopped) return;
        setRefreshAfter(result.nextStep.refresh?.refreshAfter ?? null);
      }
    } catch (error) {
      if (stopped) return;
      stop();
      catchErrorAlert(error);
    } finally {
      if (!stopped) {
        const delay = refreshAt === null ? 2000 : Math.min(2000, Math.max(0, refreshAt - Date.now()));
        timer = setTimeout(update, delay);
      }
    }
  }

  setRefreshAfter(initialRefreshAfter);
  window.addEventListener("pagehide", stop, { once: true });
  void update();
}

async function initializeDirectPopup() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sessionId = urlSearchParams.get('sessionId');
  const resultsAccessKey = urlSearchParams.get('resultsAccessKey');
  const nextStep = urlSearchParams.get('nextStep');
  const content = urlSearchParams.get('content');
  const shouldRefresh = urlSearchParams.get('shouldRefresh') === 'true';
  const refreshAfter = urlSearchParams.get('refreshAfter');
  document.getElementById("session-id").innerText = sessionId;
  document.getElementById("polling").innerText = "Yes";

  await handleNextStep(nextStep, content);
  startSessionUpdates(sessionId, resultsAccessKey, shouldRefresh ? refreshAfter : null);
}

initializeDirectPopup().catch(catchErrorAlert);
