import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

export async function launchSession(
  launchUrl: string,
  callback: {
    callbackUrl?: string | undefined;
    callbackPath?: string | undefined;
  }
): Promise<LaunchSessionResult> {
  if (launchUrl === null || launchUrl === undefined || launchUrl.length === 0) {
    throw new Error("Launch URL is required");
  }
  if (
    (callback.callbackPath === null ||
      callback.callbackPath === undefined ||
      callback.callbackPath.length === 0) &&
    (callback.callbackUrl === null ||
      callback.callbackUrl === undefined ||
      callback.callbackUrl.length === 0)
  ) {
    throw new Error("Callback URL or scheme is required");
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

  const callbackUrl =
    callback.callbackUrl || Linking.createURL(callback.callbackPath!);

  if (!url.searchParams.has("redirectUrl")) {
    url.searchParams.append("redirectUrl", callbackUrl);
  }

  try {
    let result = await WebBrowser.openAuthSessionAsync(
      url.toString(),
      callbackUrl
    );
    const { sessionId, resultsAccessKey } = parseResult(result);
    return {
      sessionId: sessionId,
      resultsAccessKey: resultsAccessKey,
      success: result.type === "success",
      canceled: result.type === "cancel" || result.type === "dismiss",
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
} {
  if (result.type === "success") {
    const url = new URL(result.url);
    const sessionId = url.searchParams.get("sessionId");
    const resultsAccessKey = url.searchParams.get("resultsAccessKey");
    return { sessionId, resultsAccessKey };
  }
  return { sessionId: null, resultsAccessKey: null };
}

export interface LaunchSessionResult {
  sessionId: string | null;
  resultsAccessKey: string | null;
  success: boolean;
  canceled: boolean;
}
