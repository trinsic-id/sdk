import { detectUserAgents } from "./detectUserAgents";

export interface TrinsicSessionResult {
  success: boolean;
  msg: "user-closed" | "failed" | "complete" | "unrecoverable-error" | string;
  sessionId?: string;
  resultsAccessKey?: string;
}

/**
 * Launches the user through a redirect towards any of the Trinsic launch URLs (applies to Widget, Hosted and Advanced Sessions).
 * @param launchUrl - The launch url retrieved from the Trinsic API.
 * @returns The method does not return a value, but redirects the user to the specified URL.
 * @example
 * await launchRedirect('https://');
 */
export async function launchRedirect(launchUrl: string) {
  launchUrl += "&launchMode=redirect";
  window.location.href = launchUrl;
}

/**
 * Launches the user through a popup towards any of the Trinsic launch URLs (applies to Widget, Hosted and Advanced Sessions).
 * @param getLaunchUrl - A promise you give us where you retrieve the launch from your backend. This is a promise because of browser restrictions in Safari where popups need to be created, opened and directed to the final domain in the same event loop.
 * @param loadingDomain - The domain of the loading page that will be used to load the launch url. This only applies if you are using domain white labelling for the session. The domain will first need to be added to the dashboard. Optional, otherwise will load from api.trinsic.id
 * @param relyingPartyName - The name of the relying party that will be used to load the launch url. Optional, otherwise will use Trinsic as the relying party name
 * @returns A promise that resolves with the result of the session.
 * @example
 * const sessionResult = await launchPopup(() => return await fetch('https://my-backend/create-session').then(res => res.json()));
 */
export async function launchPopup(
  getLaunchUrl: () => Promise<string>,
  loadingDomain?: string,
  relyingPartyName?: string
): Promise<TrinsicSessionResult> {
  const userAgents = detectUserAgents();
  const popupWidth = 600;
  const popupHeight = 900;

  const left = window.screenX + (window.outerWidth - popupWidth) / 2;
  const top = window.screenY + (window.outerHeight - popupHeight) / 2;

  const popup = window.open(
    `https://${loadingDomain || "api.trinsic.id"}/loading`,
    relyingPartyName || "Trinsic",
    userAgents.isDesktop
      ? `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
      : `width=${window.innerWidth},height=${window.innerHeight},top=0,left=0`
  );

  if (!popup) {
    throw new Error("Failed to open popup window");
  }

  // Safely retrieve a launch url and close the popup on failure.
  let launchUrl = "";
  try {
    launchUrl = await getLaunchUrl();
    if(!launchUrl) {
      throw new Error("Launch URL is empty");
    }
  }
  catch(error) {
    try {
      popup.close();
    }
    catch(error) {
      console.debug("Error closing popup", error);
    }
    throw error;
  }

  launchUrl += "&launchMode=popup";
  popup.location.href = launchUrl;

  var result = new Promise<TrinsicSessionResult>((resolve, reject) => {
    window?.addEventListener(
      "message",
      (event) => {
        console.debug("event data", event.data);
        if (event.data?.success === true) {
          popup?.close();
          resolve(event.data as TrinsicSessionResult);
        }
        if (event.data?.success === false) {
          popup?.close();
          reject(event.data as TrinsicSessionResult);
        }
      },
      false
    );
  });
  return result;
}
