import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";

window.exchangeResult = exchangeResult;
window.launchWidget = launchWidget;
window.launchHostedProvider = launchHostedProvider;

function enableButtons() {
  const elements = document.getElementsByClassName("launch-widget");
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
}

function disableButtons() {
  const elements = document.getElementsByClassName("launch-widget");
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
      const providers = r.providers.filter(
        (provider) => provider.id !== "document-scan"
      );

      for (let i = 0; i < providers.length; i++) {
        
        document.getElementById(
          "hostedProviderOptions"
        ).innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="launchHostedProvider('${providers[i].id}')"> <img src="${providers[i].logoUrl}" /> <div class="launch-name"> Launch ${providers[i].name}</div>  <div class="chevron"></div></button></li>`;
        document.getElementById(
          "advancedProviderOptions"
        ).innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="launchAdvancedProvider('${providers[i].id}')"> <img src="${providers[i].logoUrl}" /> <div class="launch-name"> Launch ${providers[i].name}</div>  <div class="chevron"></div></button></li>`;
      }
    });
}

async function launchWidget() {
  const launchUrl = window.launchUrl;
  let launchMode = document.querySelector('input[name="widgetLaunch"]:checked').value;
  await launch(launchUrl, launchMode)
}

async function launchHostedProvider(providerId) {
  const launchUrl = `launch/${providerId}?1=1`
  let launchMode = document.querySelector('input[name="hostedLaunch"]:checked').value;
  await launch(launchUrl, launchMode)
}

async function launch(launchUrl, launchMode){
  let result = null;
  switch(launchMode){
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

if (window.location.pathname !== "/redirect") {
  createUrl();
  getProviders();
}
