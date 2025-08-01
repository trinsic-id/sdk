import MicroModal from "micromodal";
import { catchErrorAlert } from "./shared";
MicroModal.init();

window.launchAdvancedProvider = launchAdvancedProvider;

async function launchAdvancedProvider(providerId) {
  let fallbackToTrinsicUI = document.querySelector('input[name="fallbackToTrinsicUI"]:checked').value;
  let checkedItems = document.querySelectorAll('input[name="TrinsicCapabilities"]:checked');
  let capabilities = Array.from(checkedItems).map(item => item.value);
  let postUrl = `advanced-launch/${providerId}?1=1`;
  postUrl += `&fallbackToTrinsicUI=${fallbackToTrinsicUI}`;
  postUrl += `&capabilities=${capabilities.join(',')}`;
  postUrl += `&redirectUrl=${window.location.origin}/redirect`;

  const result = await launchPopupAndWaitForPostMessage(postUrl).catch(e => catchErrorAlert(e));
  if(result !== undefined) {
    await exchangeResult(result);
  }
}

function launchPopupAndWaitForPostMessage(url) {
  // Determine the dimensions and position of the popup
  const popupWidth = 600;
  const popupHeight = 900;
  const left = window.screenX + (window.outerWidth - popupWidth) / 2;
  const top = window.screenY + (window.outerHeight - popupHeight) / 2;

  // Open the popup window
  const popup = window.open(
    url,
    "Trinsic Advanced Session Popup",
    `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
  );

  if (!popup) {
    throw new Error("Failed to open popup window");
  }

  // Return a promise which resolves when the popup sends a message indicating it's done
  var result = new Promise((resolve, reject) => {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data?.isTrinsicSamplePopupMessage === true) {
          popup?.close();
          resolve(event.data);
        }
      },
      false
    );
  });

    return result;
}

getProviders('launchAdvancedProvider');