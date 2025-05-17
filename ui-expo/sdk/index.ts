import * as WebBrowser from "expo-web-browser";
import { AuthSessionOpenOptions } from "expo-web-browser";

/**
 * Wraps the expo-web-browser `openAuthSessionAsync` method and parses the result into a Trinsic LaunchSessionResult.
 * For more information on the parameters, see the [expo-web-browser documentation](https://docs.expo.dev/versions/latest/sdk/webbrowser/#webbrowseropenauthsessionasyncurl-redirecturl-options).
 *
 * @param url The url to open in the web browser. This should be a login page.
 * @param redirectUrl _Optional_ - The url to deep link back into your app.
 * On web, this defaults to the output of [`Linking.createURL("")`](./linking/#linkingcreateurlpath-namedparameters).
 * @param options _Optional_ - An object extending the [`WebBrowserOpenOptions`](#webbrowseropenoptions).
 * If there is no native AuthSession implementation available (which is the case on Android)
 * these params will be used in the browser polyfill. If there is a native AuthSession implementation,
 * these params will be ignored.
 *
 * @return
 * - If the user does not permit the application to authenticate with the given url, the Promise fulfills with `{ type: 'cancel' }` object.
 * - If the user closed the web browser, the Promise fulfills with `{ type: 'cancel' }` object.
 * - If the browser is closed using [`dismissBrowser`](#webbrowserdismissbrowser),
 * the Promise fulfills with `{ type: 'dismiss' }` object.
 */
export async function launchSession(
  launchUrl: string,
  redirectUrl?: string | null,
  options: AuthSessionOpenOptions = {}
): Promise<LaunchSessionResult> {
  if (launchUrl === null || launchUrl === undefined || launchUrl.length === 0) {
    throw new Error("Launch URL is required");
  }

  const urlResult = tryParseToUrl(launchUrl);
  if (urlResult.valid === false || urlResult.url === null) {
    throw new Error("Invalid launch URL");
  }

  const url = urlResult.url;
  if (
    url.searchParams.get("sessionId") === null ||
    url.searchParams.get("sessionId") === undefined ||
    url.searchParams.get("sessionId")?.length === 0
  ) {
    throw new Error("Launch URL must contain a sessionId query parameter");
  }

  if (!url.searchParams.has("launchMode")) {
    url.searchParams.append("launchMode", "mobile");
  }

  try {
    let result = await WebBrowser.openAuthSessionAsync(
      url.toString(),
      redirectUrl,
      options
    );
    const { sessionId, resultsAccessKey, success, canceled } = parseResult(result);
    return {
      sessionId: sessionId,
      resultsAccessKey: resultsAccessKey,
      success: result.type === "success" ? success === "true" : false,
      canceled: result.type === "cancel" || result.type === "dismiss" || canceled === "true",
    };
  } catch (_) {
    return {
      sessionId: null,
      resultsAccessKey: null,
      success: false,
      canceled: false,
    };
  }
}

function tryParseToUrl(url: string): { valid: boolean; url: URL | null } {
  try {
    const parsedUrl = new URL(url);
    return { valid: true, url: parsedUrl };
  } catch (_) {
    return { valid: false, url: null };
  }
}

function parseResult(result: WebBrowser.WebBrowserAuthSessionResult): {
  sessionId: string | null;
  resultsAccessKey: string | null;
  success: string | null;
  canceled: string | null;
} {
  if (result.type === "success") {
    const url = new URL(result.url);
    const sessionId = url.searchParams.get("sessionId");
    const resultsAccessKey = url.searchParams.get("resultsAccessKey");
    const success = url.searchParams.get("success");
    const canceled = url.searchParams.get("canceled");
    return { sessionId, resultsAccessKey, success, canceled };
  }
  return { sessionId: null, resultsAccessKey: null, success: null, canceled: null };
}

export interface LaunchSessionResult {
  sessionId: string | null;
  resultsAccessKey: string | null;
  success: boolean;
  canceled: boolean;
}
