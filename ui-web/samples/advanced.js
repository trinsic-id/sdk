import { launchPopup } from "@trinsic/web-ui";
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
  const result = await launchPopup(() => postUrl + '&redirectUrl=' + window.location.origin + '/redirect').catch(e => catchErrorAlert(e));
  if(result !== undefined) {
    await exchangeResult(result);
  }
}


getProviders('launchAdvancedProvider');