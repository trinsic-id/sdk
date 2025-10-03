import { launchRedirect, createPopupAndWaitForResults } from "@trinsic/web-ui";
import { jsonHandleError, catchErrorAlert } from "./shared";
import MicroModal from "micromodal";
MicroModal.init();

window.launchHostedProvider = launchHostedProvider;

async function createHostedSession(providerId) {
  let url = `/create-hosted-session/${providerId}?redirectUrl=${window.location.origin}/redirect`;
  const session = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }).then(r => jsonHandleError(r));

  // Store resultsAccessKey from created Session in localStorage for later retrieval
  // NOTE: Do not do this in production. resultsAccessKey should be stored securely in your backend, correlated with your user's session.
  if (session.sessionId && session.resultsAccessKey) {
    localStorage.setItem(`resultsAccessKey:${session.sessionId}`, session.resultsAccessKey);
  }

  return session;
}

async function launchHostedProvider(providerId) {
  let launchMode = document.querySelector('input[name="hostedLaunch"]:checked').value;

  let result = null;
  let sessionData = null;

  switch (launchMode) {
    case 'popup':
      result = await createPopupAndWaitForResults({
        sessionCreationFunction: async () => {
          const session = await createHostedSession(providerId);
          sessionData = session;

          return session.launchUrl;
        }
      }).catch(e => catchErrorAlert(e));

      if (sessionData) {
        await exchangeResult(sessionData);
      }
      break;
    case 'redirect':
      // Create a hosted session and redirect to it
      const session = await createHostedSession(providerId);
      await launchRedirect(session.launchUrl).catch(e => catchErrorAlert(e));
      break;
  }
}

getProviders('launchHostedProvider');