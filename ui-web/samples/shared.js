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
    let errorMessage = "";
    let errorDetails = "";
    // Check if the error is a Trinsic error
    if (error.success === false) {
        console.warn("Trinsic error:", error);
        errorMessage = `Message: ${error.msg}\nSession Id: ${error.sessionId}` || `An unknown error occurred.`;
    } else {
        console.error("Error:", error);
        errorMessage = error?.message || "An unknown error occurred.";
    }
    // Show error message after short timeout to not delay the popup closing
    setTimeout(() => {
        alert(errorMessage);
    }, 150);

}
export async function jsonHandleError(response) {
    if (!response.ok) {
        console.warn("Request failed: parsing to an alert", response);

        let alertText = "Request failed: check the logs on the backend for more information.\nUrl: " + response.url;

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
    }).then(r => jsonHandleError(r))
    document.getElementById("results").innerText = JSON.stringify(result, null, 2);
    MicroModal.show('results-modal');
}

async function getProviders(launchMethod) {
    let url = "/providers";

    const doIp = document.getElementById("doRecommendation").checked === true;
    if (doIp) {
        const ip = await window.ipAddress();
        if (ip) {
            url += `?ipAddress=${ip}`;
        }
    }

    const providers = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },

    })
        .then(r => jsonHandleError(r));

        console.log(providers);

    const container = document.getElementById("recommendedProviders");
    container.innerHTML = "";
    for (let i = 0; i < providers.recommendedProviders.length; i++) {

        container.innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="${launchMethod}('${providers.recommendedProviders[i].id}')"> <img src="${providers.recommendedProviders[i].logoUrl}" /> <div class="launch-name"> Launch ${providers.recommendedProviders[i].name}</div>  <div class="chevron"></div></button></li>`;
    }
}

window.ipAddress();