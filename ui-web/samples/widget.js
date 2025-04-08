import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";
import MicroModal from "micromodal";
MicroModal.init();

window.launchWidget = launchWidget;

async function launchWidget() {
    let launchMode = document.querySelector('input[name="widgetLaunch"]:checked').value;
    await launch(launchMode)
}

async function createSession(withRedirect) {
    let url = '/create-session';
    if(withRedirect){
        url += '?redirectUrl=' + window.location.origin + '/redirect';
    }
    const launchUrl = await fetch(url, {
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
                return await createSession();
            });
            await exchangeResult(result);
            break;
        case 'iframe':
            const launchUrl = await createSession();
            result = await launchIframe(launchUrl);
            await exchangeResult(result);
            break;
        case 'redirect':
            const redirectLaunchUrl = await createSession(true);
            await launchRedirect(redirectLaunchUrl);
            break;
        default:
            console.error("Invalid launch mode:", launchMode);
    }
}