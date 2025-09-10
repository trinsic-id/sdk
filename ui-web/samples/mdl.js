import { performMdlExchange } from "@trinsic/web-ui";
import MicroModal from "micromodal";
MicroModal.init();

window.launchMdlExchange = launchMdlExchange;
window.executeMdlExchange = executeMdlExchange;

async function launchMdlExchange() {
  const verificationProfileId = document.querySelector('input[name="verificationProfileId"]').value;
  const providerId = document.querySelector('input[name="mdlProvider"]').value;
  const documentType = document.querySelector('input[name="mdlDocumentType"]:checked').value;
  const willRetain = document.querySelector('input[name="willRetain"]').checked;

  const fieldCheckboxes = document.querySelectorAll('input[name="mdlFields"]:checked');
  const requestedFields = Array.from(fieldCheckboxes).map(cb => cb.value);

  const payload = {
    verificationProfileId: verificationProfileId,
    providerId: providerId,
    documentType: documentType,
    requestedFields: requestedFields,
    willRetain: willRetain,
  }

  console.log(payload);

  const result = await fetch("/mdl/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const exchangeData = await result.json();
  window.mdlExchangeData = exchangeData;

  document.getElementById("exchangeInfo").innerText = JSON.stringify(exchangeData, null, 2);
  MicroModal.show('exchange-modal');
}

async function executeMdlExchange() {
  try {
    const verificationProfileId = document.querySelector('input[name="verificationProfileId"]').value;
    const exchangeData = window.mdlExchangeData;
    const exchangeId = exchangeData.exchangeId;
    const exchangeContext = exchangeData.exchangeContext;
    const requestObjectBase64 = exchangeData.requestObjectBase64;

    // `performMdlExchange` is a function in Trinsic's Web SDK.
    // `requestObjectBase64` is a string that comes directly from the "create exchange" endpoint -- it is passed in exactly as-is.
    const mdlResult = await performMdlExchange(requestObjectBase64);
    const resultExchangeId = mdlResult.exchangeId;
    const resultToken = mdlResult.token; // This is a string that should be sent to Trinsic's "finalize exchange" endpoint exactly as-is.

    const payload = {
      verificationProfileId: verificationProfileId,
      exchangeId: mdlResult.exchangeId,
      exchangeContext: exchangeContext,
      token: mdlResult.token,
    };
    document.getElementById("exchangeInfo").innerText = JSON.stringify(payload, null, 2);

    const result = await fetch("/mdl/finalize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await result.json();

    MicroModal.close('exchange-modal');
    document.getElementById("results").innerText = JSON.stringify(responseData, null, 2);
    MicroModal.show('results-modal');
  } catch (e) {
    console.error("Error occurred during mDL exchange:", e);
    document.getElementById("error").innerText = e.message;
    MicroModal.close('exchange-modal');
    MicroModal.close('results-modal');
    MicroModal.show('error-modal');
  }

}