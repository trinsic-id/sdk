import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";
import MicroModal from "micromodal";
MicroModal.init();

window.launchHostedProvider = launchHostedProvider;

function getProviders() {
  fetch("/providers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((r) => {
      const providers = r.providers.filter(
        (provider) => provider.id !== "document-scan"
      );

      for (let i = 0; i < providers.length; i++) {

        document.getElementById(
          "hostedProviderOptions"
        ).innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="launchHostedProvider('${providers[i].id}')"> <img src="${providers[i].logoUrl}" /> <div class="launch-name"> Launch ${providers[i].name}</div>  <div class="chevron"></div></button></li>`;
       
      }
    });
}

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

getProviders();