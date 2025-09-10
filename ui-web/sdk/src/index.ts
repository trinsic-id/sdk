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


/**
 * The result of a successful mDL Exchange.
 */
export interface MdlExchangeResult {
    /**
     * The Exchange ID of the completed mDL Exchange.
     */
    exchangeId: string;

    /**
     * The output token from the completed mDL Exchange. Send to Trinsic's API exactly as-is.
     */
    token: string;
}

/**
 * Perform an mDL Exchange against a request object received from Trinsic's API.
 * @param requestObjectBase64Url The base64url-encoded request string, exactly as received from Trinsic's API.
 * @returns The successful result of the mDL Exchange, including the exchange ID and output token.
 * @throws Error if the request object is invalid, or if the exchange cannot be completed.
 * @example
 * const result = await performMdlExchange(requestObjectStringFromTrinsic);
 * const token = result.token; // Send this to Trinsic's API
 */
export async function performMdlExchange(requestObjectBase64Url: string) : Promise<MdlExchangeResult> {
  // Decode outer request object from base64url
  const outerRequestObject = JSON.parse(atob(requestObjectBase64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/')));

  // Extract expected fields from request object
  const exchangeId = outerRequestObject.exchangeId;
  const type = outerRequestObject.type;
  const platform = outerRequestObject.platform;
  const exchangeMechanism = outerRequestObject.exchangeMechanism;
  const innerRequestObjectEncoded = outerRequestObject.requestObject;

  // If no expected fields are found, throw an error
  if (!type || !platform || !exchangeMechanism || !innerRequestObjectEncoded || !exchangeId) {
    throw new Error("Invalid request object");
  }

  // Validate expected field values
  if (type !== "mdlRequest") {
    throw new Error("Unexpected request type '" + type + "'");
  }

  if (platform !== "google-wallet" && platform !== "apple-wallet") {
    throw new Error("Unexpected platform '" + platform + "'");
  }


  if (exchangeMechanism === "NativeApp") {
    throw new Error("This request was created for the 'NativeApp' exchange mechanism, and can only be used in a native mobile app.");
  } else if (exchangeMechanism !== "DigitalCredentialsApi") {
    throw new Error("Unexpected exchange mechanism '" + exchangeMechanism + "'");
  }

  // Decode inner request object from base64url
  const innerRequestObject = JSON.parse(innerRequestObjectEncoded);

  // Ensure the request object has the expected "requests" field
  if (!innerRequestObject.requests || !Array.isArray(innerRequestObject.requests)) {
    throw new Error("Invalid digital credential request object");
  }

  // Construct digital credential request
  const req = {
    digital: innerRequestObject,
    mediation: undefined,
  };

  // Perform the DC API exchange
  const response = await navigator.credentials.get(req);

  // We have to massage the response a bit to make it serializable.
  const responseAny: any = response;
  const massagedResponse = {
    protocol: responseAny.protocol,
    type: responseAny.type,
    data: responseAny.data
  };

  // Serialize the response as a base64url-encoded JSON string
  const jsonified = JSON.stringify(massagedResponse);
  const base64urlEncoded = btoa(jsonified)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return {
    exchangeId: exchangeId,
    token: base64urlEncoded,
  };
}

/**
 * Performs useragent sniffing to determine if the user is on an Apple Wallet-supporting device.
 * 
 * This can help determine which wallet options to display to the user.
 * 
 * NOTE: This is a simple heuristic and is likely not 100% accurate at this time.
 *
 * @returns Whether the user is on an Apple Wallet-supporting browser
 */
export function isUserOnEligibleAppleWalletBrowser(): boolean {
  if(!navigator.credentials || !navigator.credentials.get) {
    return false;
  }

  const userAgents = detectUserAgents();
  return userAgents.isIos || userAgents.isSafari || userAgents.isMacOs || !!(window as any).ApplePaySession;
}

/**
 * Performs useragent sniffing to determine if the user is on an Android device using Chrome.
 * 
 * This can help determine which wallet options to display to the user.
 * 
 * NOTE: This is a simple heuristic and is likely not 100% accurate at this time.
 *
 * @returns Whether the user is on a Google Wallet-supporting browser
 */
export function isUserOnEligibleGoogleWalletBrowser(): boolean {
  if(!navigator.credentials || !navigator.credentials.get) {
    return false;
  }

  const userAgents = detectUserAgents();
  return userAgents.isAndroid && userAgents.isChrome;
}