import { launchRedirect, createPopupAndWaitForResults } from "@trinsic/web-ui";
import { jsonHandleError, catchErrorAlert } from "./shared";
import MicroModal from "micromodal";
MicroModal.init();

window.launchWidget = launchWidget;

async function launchWidget() {
    let launchMode = document.querySelector('input[name="widgetLaunch"]:checked').value;
    await launch(launchMode)
}

async function createWidgetSession(withRedirect) {
    let url = '/create-widget-session';
    if (withRedirect) {
        url += '?redirectUrl=' + window.location.origin + '/redirect';
    }
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

async function launch(launchMode) {
    let result = null;
    let sessionData = null;
    switch (launchMode) {
        case 'popup':
            console.log("Launching widget in popup mode");
            result = await createPopupAndWaitForResults({
                sessionCreationFunction: async () => {
                    const session = await createWidgetSession();
                    sessionData = session;
                    return session.launchUrl;
                }
            }).catch(e => catchErrorAlert(e));
            break;
        case 'redirect':
            const session = await createWidgetSession(true);
            await launchRedirect(session.launchUrl).catch(e => catchErrorAlert(e));
            break;
        default:
            console.error("Invalid launch mode:", launchMode);
            return;
    }
    if (result) {
        console.log("Codes from `createPopupAndWaitForResults`:", result);
        await exchangeResult(sessionData);
    }
}