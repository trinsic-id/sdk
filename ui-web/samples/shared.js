window.exchangeResult = exchangeResult;
window.getProviders = getProviders;
window.ipAddress = async () => {
    try {
        const data = await fetch("https://ipwhois.app/json/").then(r => jsonHandleError(r));
        const ip = data?.ip ?? null;
        return ip;
    } catch (error) {
        console.error("Failed to fetch country code:", error);
        return null;
    }
}
export function catchErrorAlert(error) {
    console.error("Error:", error);
    const errorMessage = error?.message || "An unknown error occurred.";
    const errorDetails = error?.details || "No additional details available.";
    // Show error message after short timeout to not delay the popup closing
    setTimeout(() => {
        alert(`Error: ${errorMessage}\nDetails: ${errorDetails}`);
    }, 150);
    
}
export async function jsonHandleError(response) {
    if (!response.ok) {
        console.warn("Request failed, parsing to an alert", response);       

        let alertText = "Request failed, check the logs on the backend for more information.\nUrl: " + response.url;        

        // Show error message after short timeout to not delay the popup closing
        setTimeout(() => {
            alert(alertText);
        }, 150);
        throw new Error(alertText);
    }
    const data = await response.json();
    return data;
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
        .then(r => jsonHandleError(r))
    document.getElementById("results").innerText = JSON.stringify(result, null, 2);
    MicroModal.show('results-modal');
}

async function getProviders(launchMethod) {
    const ip = await window.ipAddress();
    let url = "/providers";
    if (ip) {
        url += `?ipAddress=${ip}`;
    }
    const providers = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },

    })
        .then(r => jsonHandleError(r));

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