import { catchErrorAlert, jsonHandleError } from "./shared";
import { launchRedirect } from "@trinsic/web-ui";

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
  const capabilities = Array.from(document.querySelectorAll('input[name="TrinsicCapabilities"]:checked')).map(item => item.value);
  if (capabilities.includes("LaunchBrowser") && capabilities.includes("PollResult")) {
    catchErrorAlert(new Error("LaunchBrowser and PollResult cannot be selected together in a redirect flow."));
    return;
  }

  const session = await createDirectSession(providerId);
  if (session.nextStep?.method === "LaunchBrowser") {
    await launchRedirect(session.nextStep.content).catch(e => catchErrorAlert(e));
    return;
  }

  const nextStepUrl = new URL(`${location.origin}/direct-session.html`);
  nextStepUrl.searchParams.set("sessionId", session.sessionId);
  nextStepUrl.searchParams.set("nextStep", session.nextStep?.method || "");
  nextStepUrl.searchParams.set("content", session.nextStep?.content || "");
  nextStepUrl.searchParams.set("shouldRefresh", String(session.nextStep?.refresh != null));
  nextStepUrl.searchParams.set("refreshAfter", session.nextStep?.refresh?.refreshAfter || "");
  window.location.href = nextStepUrl.toString();
}

getProviders('launchDirectProvider');
