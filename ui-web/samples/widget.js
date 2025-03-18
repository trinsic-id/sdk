import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";
import MicroModal from "micromodal";
MicroModal.init();

window.launchWidget = launchWidget;

async function launchWidget() {
    let launchMode = document.querySelector('input[name="widgetLaunch"]:checked').value;
    await launch(launchMode)
}

async function createSession() {
    const launchUrl = await fetch(`/create-session?redirectUrl=${window.location.origin + '/redirect'}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((response) => response.json())
        .then((r) => r.launchUrl);
    return launchUrl;
}

async function launch(launchMode) {
    let result = null;
    switch (launchMode) {
        case 'popup':
            result = await launchPopup(async () => {
                const launchUrl = await createSession();
                return launchUrl +  '&redirectUrl=' + window.location.origin + '/redirect';
            });
            await exchangeResult(result);
            break;
        case 'iframe':
            const launchUrl = await createSession();
            result = await launchIframe(launchUrl);
            await exchangeResult(result);
            break;
        case 'redirect':
            const redirectLaunchUrl = await createSession();
            await launchRedirect(redirectLaunchUrl, '');
            break;
        default:
            console.error("Invalid launch mode:", launchMode);
    }
}