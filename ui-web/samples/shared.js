window.exchangeResult = exchangeResult;

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