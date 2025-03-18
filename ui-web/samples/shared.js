window.exchangeResult = exchangeResult;
window.getProviders = getProviders;
window.ipAddress = async () => {
    try {
        const response = await fetch("https://ipwhois.app/json/");
        const data = await response.json();
        const ip = data?.ip ?? null;
        return ip;
      } catch (error) {
        console.error("Failed to fetch country code:", error);
      }
}
async function exchangeResult(response) {
    console.debug("Exchanging result, response:", response);
    const result = await fetch("/exchange-result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sessionId: response.sessionId,
            resultsAccessKey: response.resultsAccessKey,
        }),
    })
        .then((response) => response.json());
    document.getElementById("results").innerText = JSON.stringify(result, null, 2);
    MicroModal.show('results-modal');
}

async function getProviders(launchMethod) {
    const ip = await window.ipAddress();
    const providers = await fetch(`/providers?ipAddress=${ip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },

    })
        .then((response) => response.json());
    
    for (let i = 0; i < providers.recognized.length; i++) {

        document.getElementById(
            "recognizedProviders"
        ).innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="${launchMethod}('${providers.recognized[i].providerId}')"> <img src="${providers.recognized[i].providerLogo}" /> <div class="launch-name"> Launch ${providers.recognized[i].providerDisplayName}</div>  <div class="chevron"></div></button></li>`;

    }

    for (let i = 0; i < providers.relevant.length; i++) {

        document.getElementById(
            "relevantProviders"
        ).innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="${launchMethod}('${providers.relevant[i].providerId}')"> <img src="${providers.relevant[i].providerLogo}" /> <div class="launch-name"> Launch ${providers.relevant[i].providerDisplayName}</div>  <div class="chevron"></div></button></li>`;

    }

    for (let i = 0; i < providers.remainder.length; i++) {

        document.getElementById(
            "remainderProviders"
        ).innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="${launchMethod}('${providers.remainder[i].providerId}')"> <img src="${providers.remainder[i].providerLogo}" /> <div class="launch-name"> Launch ${providers.remainder[i].providerDisplayName}</div>  <div class="chevron"></div></button></li>`;

    }
}

window.ipAddress();