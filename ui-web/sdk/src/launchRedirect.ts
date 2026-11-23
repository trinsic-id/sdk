/**
 * Launches the user through a redirect towards a Trinsic Session launch URL.
 * @param launchUrl - The launch url retrieved from the Trinsic API.
 * @returns The method does not return a value, but redirects the user to the specified URL.
 * @example
 * await launchRedirect('https://');
 */
export async function launchRedirect(launchUrl: string) {
  if (window.top !== window) {
    throw new Error("launchRedirect must be called from the top-level browsing context");
  }

  let url: URL;
  try {
    url = new URL(launchUrl);
  } catch {
    throw new Error("Invalid Trinsic Session launch URL");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Invalid Trinsic Session launch URL");
  }

  url.searchParams.set("launchMode", "redirect");
  window.location.href = url.toString();
}
