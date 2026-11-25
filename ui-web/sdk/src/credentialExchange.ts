import { detectUserAgents } from "./detectUserAgents";

/** The result of a successful credential exchange. */
export interface CredentialExchangeResult {
  exchangeId: string;
  /** Send this token to Trinsic's API exactly as received. */
  token: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseChallenge(encoded: string) {
  if (typeof encoded !== "string" || !/^[A-Za-z0-9_-]+={0,2}$/.test(encoded)) {
    throw new Error("Invalid base64url credential challenge");
  }

  let envelope: unknown;
  try {
    const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    envelope = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new Error("Invalid credential challenge encoding or JSON");
  }

  if (!isObject(envelope)) {
    throw new Error("Invalid credential challenge envelope");
  }
  if (!Object.prototype.hasOwnProperty.call(envelope, "v1")) {
    throw new Error("Unsupported credential challenge version (expected v1)");
  }
  // v1 is self-contained, even when the server also sends legacy or future versions.
  const request = envelope.v1;
  if (!isObject(request) || typeof request.exchangeId !== "string" || !request.exchangeId.trim()) {
    throw new Error("Invalid v1 credential request or exchange ID");
  }
  if (request.type !== "credentialRequest") {
    throw new Error("Expected v1 request type 'credentialRequest'");
  }
  if (request.platform !== "google-wallet" && request.platform !== "apple-wallet") {
    throw new Error("Unsupported credential exchange platform");
  }
  if (request.exchangeMechanism === "NativeApp") {
    throw new Error("This credential request can only be used in a native mobile app.");
  }
  if (request.exchangeMechanism !== "DigitalCredentialsApi") {
    throw new Error("Expected exchange mechanism 'DigitalCredentialsApi'");
  }

  if (typeof request.requestObject !== "string") {
    throw new Error("Expected requestObject to be a JSON string");
  }
  let digital: unknown;
  try {
    digital = JSON.parse(request.requestObject);
  } catch {
    throw new Error("Invalid digital credential request JSON");
  }
  if (!isObject(digital) || !Array.isArray(digital.requests)) {
    throw new Error("Expected a digital credential requests array");
  }
  return { exchangeId: request.exchangeId, digital };
}

/** Perform a credential exchange using the base64url challenge received from Trinsic's API. */
export async function performCredentialExchange(
  requestObjectBase64Url: string
): Promise<CredentialExchangeResult> {
  const request = parseChallenge(requestObjectBase64Url);
  const options = { digital: request.digital, mediation: "required" as const };
  const response = await navigator.credentials.get(options);
  if (!response) {
    throw new Error("Your browser does not support this feature");
  }

  // DigitalCredential properties can be inherited getters, so copy them before serializing.
  const credential = response as Credential & { protocol: string; data: unknown };
  const json = JSON.stringify({
    protocol: credential.protocol,
    type: credential.type,
    data: credential.data,
  });
  const bytes = new TextEncoder().encode(json);
  const binary = bytes.reduce((result, byte) => result + String.fromCharCode(byte), "");
  const token = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return { exchangeId: request.exchangeId, token };
}

/**
 * Performs useragent sniffing to determine if the user is on an Apple Wallet-supporting device.
 *
 * This can help determine which wallet options to display to the user.
 *
 * @returns Whether the user is on an Apple Wallet-supporting browser
 */
export function isUserOnEligibleAppleWalletBrowser(): boolean {
  const userAgents = detectUserAgents();
  return userAgents.supportsDigitalCredentialsApi && (
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
 * @returns Whether the user is on a Google Wallet-supporting browser
 */
export function isUserOnEligibleGoogleWalletBrowser(): boolean {
  const userAgents = detectUserAgents();
  return userAgents.supportsDigitalCredentialsApi && userAgents.isAndroid && userAgents.isChrome;
}
