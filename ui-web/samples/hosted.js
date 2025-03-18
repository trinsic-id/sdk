import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";
import MicroModal from "micromodal";
MicroModal.init();

window.launchHostedProvider = launchHostedProvider;

async function launchHostedProvider(providerId) {
  const launchUrl = `hosted-launch/${providerId}?1=1`
  let launchMode = document.querySelector('input[name="hostedLaunch"]:checked').value;
  await launch(launchUrl, launchMode)
}

async function launch(launchUrl, launchMode) {
  let result = null;
  switch (launchMode) {
    case 'popup':
      result = await launchPopup(() => launchUrl + '&redirectUrl=' + window.location.origin + '/redirect');
      await exchangeResult(result);
      break;
    case 'iframe':
      console.log("launching iframe ", launchUrl);
      result = await launchIframe(launchUrl);
      await exchangeResult(result);
      break;
    case 'redirect':
      //Result is exchanged through the redirect capture, see redirect.html
      await launchRedirect(launchUrl, window.location.origin + '/redirect');
      break;
  }
}

getProviders('launchHostedProvider');