import MicroModal from "micromodal";
import { catchErrorAlert, jsonHandleError } from "./shared";
import { createPopupAndWaitForResults } from "@trinsic/web-ui";
MicroModal.init();

window.launchDirectProvider = launchDirectProvider;

async function createDirectSession(providerId) {
  // Construct POST URL
  let fallbackToTrinsicUI = document.querySelector('input[name="fallbackToTrinsicUI"]:checked').value;
  let checkedItems = document.querySelectorAll('input[name="TrinsicCapabilities"]:checked');
  let capabilities = Array.from(checkedItems).map(item => item.value);
  let postUrl = `/create-direct-session/${providerId}`;
  postUrl += `?fallbackToTrinsicUI=${fallbackToTrinsicUI}`;
  postUrl += `&capabilities=${capabilities.join(',')}`;
  postUrl += `&redirectUrl=${window.location.origin}/redirect`;
  const session = await fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }).then(r => jsonHandleError(r));

  // Store resultsAccessKey from created Session in localStorage for later retrieval
  // NOTE: Do not do this in production. resultsAccessKey should be stored securely in your backend, correlated with your user's session.
  if (session.sessionId && session.resultCollection?.resultsAccessKey) {
    localStorage.setItem(`resultsAccessKey:${session.sessionId}`, session.resultCollection.resultsAccessKey);
  }

  return session;
}

async function launchDirectProvider(providerId) {
  let sessionData = null;

  await createPopupAndWaitForResults({
    sessionCreationFunction: async () => {
      const session = await createDirectSession(providerId);

      sessionData = {
        sessionId: session.sessionId,
        resultsAccessKey: session.resultCollection?.resultsAccessKey
      };

      // If the next step is "LaunchBrowser", just return the next step's launch URL.
      // If the next step is anything else, then we should return a URL that points to our direct-session-handling popup.
      if (session.nextStep?.method === "LaunchBrowser") {
        return session.nextStep.content;
      } else {
        return `${location.origin}/direct-popup?sessionId=${session.sessionId}&resultsAccessKey=${session.resultCollection?.resultsAccessKey}&nextStep=${session.nextStep?.method}&content=${encodeURIComponent(session.nextStep?.content || "")}&shouldRefresh=${(session.nextStep?.refresh != null).toString().toLowerCase()}&refreshAfter=${encodeURIComponent(session.nextStep?.refresh?.refreshAfter || "")}`
      }
    }
  }).catch(e => catchErrorAlert(e));

  if (sessionData) {
    await exchangeResult(sessionData);
  }
}

getProviders('launchDirectProvider');