import { launchPopup } from "@trinsic/web-ui";
import MicroModal from "micromodal";
MicroModal.init();

window.launchAdvancedProvider = launchAdvancedProvider;

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
          "advancedProviderOptions"
        ).innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="launchAdvancedProvider('${providers[i].id}')"> <img src="${providers[i].logoUrl}" /> <div class="launch-name"> Launch ${providers[i].name}</div>  <div class="chevron"></div></button></li>`;
      }
    });
}


async function launchAdvancedProvider(providerId) {
  let fallbackToTrinsicUI = document.querySelector('input[name="fallbackToTrinsicUI"]:checked').value;
  let checkedItems = document.querySelectorAll('input[name="TrinsicCapabilities"]:checked');
  let capabilities = Array.from(checkedItems).map(item => item.value);
  let postUrl = `advanced-launch/${providerId}?1=1`;
  postUrl += `&fallbackToTrinsicUI=${fallbackToTrinsicUI}`;
  postUrl += `&capabilities=${capabilities.join(',')}`;

  const result = await launchPopup(() => postUrl + '&redirectUrl=' + window.location.origin + '/redirect');
    await exchangeResult(result);
}


getProviders();