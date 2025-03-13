import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";

window.exchangeResult = exchangeResult;
window.launchWidget = launchWidget;
window.launchHostedProvider = launchHostedProvider;
window.launchAdvancedProvider = launchAdvancedProvider;

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
  const launchUrl = `hosted-launch/${providerId}?1=1`
  let launchMode = document.querySelector('input[name="hostedLaunch"]:checked').value;
  await launch(launchUrl, launchMode)
}

async function launchAdvancedProvider(providerId) {
  let launchMode = document.querySelector('input[name="advancedLaunch"]:checked').value;
  let fallbackToTrinsicUI = document.querySelector('input[name="fallbackToTrinsicUI"]:checked').value;
  let checkedItems = document.querySelectorAll('input[name="TrinsicCapabilities"]:checked');
  let capabilities = Array.from(checkedItems).map(item => item.value);
  let postUrl = `advanced-launch/${providerId}?1=1`;
  postUrl += `&fallbackToTrinsicUI=${fallbackToTrinsicUI}`;
  postUrl += `&capabilities=${capabilities.join(',')}`;
  postUrl += `&redirectUrl=${window.location.origin + '/redirect'}`;

  const response = await fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  
  const result = await response.json();

  if(response.ok) {
    if (result.NextStep.Method === "LaunchBrowser") {
      const url = result.NextStep.Content;
      launch(url, launchMode);
    }
  }
  else {
    console.error("An error occured", result);
    console.log(result);
    let errorMessages = [];
    errorMessages.push('Message: ' + result.title);
    errorMessages.push('Trace id: ' + result.traceId);
    errorMessages.push('');
      // Iterate over errors and format messages
      for (const [field, messages] of Object.entries(result.errors)) {
          messages.forEach(msg => errorMessages.push(`${field}: ${msg}`));
      }

      // Join messages and show alert
      if (errorMessages.length > 0) {
          alert(`${errorMessages.join("\n")}`);
      }
  }

  

  

//   {
//     "NextStep": {
//         "Method": "LaunchBrowser",
//         "Content": "https://api.trinsic.id/api/session/launch?clientToken=3Z43R7NPrPY4ypaUzXNTeJqMjmnUgBXAV5uWe2L77jwW5hUP97m3VJr8yQ7cM7jb5kqsNuGNLQfbJzWYrnc1ZfHu6e7uafKSwmrigCaHcm5te5ivmsCmURdpR4ab92fGdV3dpCZt5M7AWQmp5bLvpq2mDRbfVk4uiP1T9gaYvyznuGvQ4Xowvc8teqr2yNXi21RmTZUjnANuaNphq3wTc8DoucHtsnXRiBT4qGk2eudeiK4RcehU8U7gTxPWfervVTZ9aX7sQKwJLLVmhgjCds6ixnzkYg9VniZFdwtoe4DjCQhq7fW&sessionId=d73dac28-8dfe-4f98-ba3e-8f16f8311f53",
//         "Refresh": null
//     },
//     "ResultCollection": {
//         "Method": "CaptureRedirect",
//         "ResultsAccessKey": null
//     },
//     "SessionId": "d73dac28-8dfe-4f98-ba3e-8f16f8311f53"
// }

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

if (window.location.pathname !== "/redirect") {
  createUrl();
  getProviders();
}
