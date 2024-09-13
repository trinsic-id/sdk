import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";

window.launchIframe = launchIframe;
window.launchRedirect = launchRedirect;
window.launchPopup = launchPopup;
window.launchPopupMethod = launchPopupMethod;
window.exchangeResult = exchangeResult;

function enableButtons() {
  const elements = document.getElementsByClassName("launch-button");
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
}

function disableButtons() {
  const elements = document.getElementsByClassName("launch-button");
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
}

async function createUrl() {
  disableButtons();
  const launchUrl = await fetch("/create-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((r) => r.launchUrl);
  window.launchUrl = launchUrl;
  enableButtons();
}

function exchangeResult(response) {
  console.debug("Exchanging result, response:", response);
  fetch("/exchange-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: response.sessionId,
      resultsAccessKey: response.resultsAccessKey,
    }),
  })
    .then((response) => response.json())
    .then(
      (r) =>
        (document.getElementById("results").innerText = JSON.stringify(
          r,
          null,
          2
        ))
    );
  //prepare for a next launch
  createUrl();
}

function getProviders() {
  fetch("/providers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((r) => {
      for (let i = 0; i < r.providers.length; i++) {
        document.getElementById("listOptions").innerHTML +=
          `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="launchPopupMethod('${r.providers[i].id}').then(r => exchangeResult(r))"> <img src="${r.providers[i].logoUrl}" /> <div class="launch-name"> Launch ${r.providers[i].name}</div>  <div class="chevron"></div></button></li>`;
      }
    });
}

async function launchPopupMethod(provider) {
  return launchPopup(
    async () => `launch/${provider}?redirectUrl=${window.location.origin}/redirect`
  );
}

createUrl();
getProviders();
