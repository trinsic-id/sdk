window.getProviders = getProviders;
window.ipAddress = async () => {
    try {
        const response = await fetch("https://ipwhois.app/json/");
        if (!response.ok) return null;
        const data = await response.json();
        const ip = data?.ip ?? null;
        return ip;
    } catch (error) {
        console.error("Failed to fetch IP address:", error);
        return null;
    }
}

export function catchErrorAlert(error) {
    console.error("Error:", error);
    const errorMessage = error?.message || "An unknown error occurred.";
    // Defer the alert so errors are displayed after the current event completes.
    setTimeout(() => {
        alert(errorMessage);
    }, 150);

}
export async function jsonHandleError(response) {
    if (!response.ok) {
        console.warn("Request failed: parsing to an alert", response);

        let alertText = "Request failed: check the logs on the backend for more information.\nUrl: " + response.url;

        // Defer the alert so errors are displayed after the current event completes.
        setTimeout(() => {
            alert(alertText);
        }, 150);
        throw new Error(alertText);
    }
    const data = await response.json();
    return data;
}

export async function exchangeResult(response) {
    const result = await fetch("/exchange-result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sessionId: response.sessionId,
            resultsAccessKey: response.resultsAccessKey,
            redirectToken: response.redirectToken,
        }),
    }).then(jsonHandleError);
    document.getElementById("session-id").innerText = response.sessionId;
    document.getElementById("results").innerText = JSON.stringify(result, null, 2);
    document.getElementById("result-loading").hidden = true;
    document.getElementById("result-card").hidden = false;
}

async function getProviders(launchMethod) {
    let url = "/providers";

    const doIp = document.getElementById("doRecommendation").checked === true;
    if (doIp) {
        const ip = await window.ipAddress();
        if (ip) {
            url += `?ipAddress=${encodeURIComponent(ip)}`;
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
    // The API returns every other available provider in remainder. Without
    // recommendation inputs, recommendedProviders can be empty.
    const availableProviders = [...providers.recommendedProviders, ...providers.remainder];
    for (const provider of availableProviders) {
        container.innerHTML += `<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="${launchMethod}('${provider.id}')"> <img src="${provider.logoUrl}" /> <div class="launch-name"> Launch ${provider.name}</div>  <div class="chevron"></div></button></li>`;
    }
}
