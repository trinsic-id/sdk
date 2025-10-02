/**
 * Launches the user through a redirect towards a Trinsic Session launch URL.
 * @param launchUrl - The launch url retrieved from the Trinsic API.
 * @returns The method does not return a value, but redirects the user to the specified URL.
 * @example
 * await launchRedirect('https://');
 */
export async function launchRedirect(launchUrl: string) {
  launchUrl += "&launchMode=redirect";
  window.location.href = launchUrl;
}