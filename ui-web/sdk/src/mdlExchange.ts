import { detectUserAgents } from "./detectUserAgents";

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
export async function performMdlExchange(
  requestObjectBase64Url: string
): Promise<MdlExchangeResult> {
  // Decode outer request object from base64url
  const outerRequestObject = JSON.parse(
    atob(requestObjectBase64Url.replace(/-/g, "+").replace(/_/g, "/"))
  );

  // Extract expected fields from request object
  const exchangeId = outerRequestObject.exchangeId;
  const type = outerRequestObject.type;
  const platform = outerRequestObject.platform;
  const exchangeMechanism = outerRequestObject.exchangeMechanism;
  const innerRequestObjectEncoded = outerRequestObject.requestObject;

  // If no expected fields are found, throw an error
  if (
    !type ||
    !platform ||
    !exchangeMechanism ||
    !innerRequestObjectEncoded ||
    !exchangeId
  ) {
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
    throw new Error(
      "This request was created for the 'NativeApp' exchange mechanism, and can only be used in a native mobile app."
    );
  } else if (exchangeMechanism !== "DigitalCredentialsApi") {
    throw new Error(
      "Unexpected exchange mechanism '" + exchangeMechanism + "'"
    );
  }

  // Decode inner request object from base64url
  const innerRequestObject = JSON.parse(innerRequestObjectEncoded);

  // Ensure the request object has the expected "requests" field
  if (
    !innerRequestObject.requests ||
    !Array.isArray(innerRequestObject.requests)
  ) {
    throw new Error("Invalid digital credential request object");
  }

  // Construct digital credential request
  const req = {
    digital: innerRequestObject,
    mediation: undefined,
  };

  // Perform the DC API exchange
  const response = await navigator.credentials.get(req);

  // If a single credential cannot be unambiguously obtained, the promise resolves with null.
  if (response === null || response === undefined) {
    throw new Error("Your wallet app was unable to find a suitable document.");
  }

  // We have to massage the response a bit to make it serializable.
  const responseAny: any = response;
  const massagedResponse = {
    protocol: responseAny.protocol,
    type: responseAny.type,
    data: responseAny.data,
  };

  // Serialize the response as a base64url-encoded JSON string
  const jsonified = JSON.stringify(massagedResponse);
  const base64urlEncoded = btoa(jsonified)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

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
  if (!navigator.credentials || !navigator.credentials.get) {
    return false;
  }

  const userAgents = detectUserAgents();
  return (
    userAgents.isIos ||
    userAgents.isSafari ||
    userAgents.isMacOs ||
    !!(window as any).ApplePaySession
  );
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
  if (!navigator.credentials || !navigator.credentials.get) {
    return false;
  }

  const userAgents = detectUserAgents();
  return userAgents.isAndroid && userAgents.isChrome;
}
