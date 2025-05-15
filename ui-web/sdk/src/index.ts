import { detectUserAgents } from "./detectUserAgents";
import MicroModal from "micromodal";

export interface TrinsicSessionResult {
  success: boolean;
  msg: "user-closed" | "failed" | "complete" | "unrecoverable-error" | string;
  sessionId?: string;
  resultsAccessKey?: string;
}

let isMicroModalInitialized = false;

/**
 * Launches an iFrame for the Trinsic Widget UI that waits for the user to complete their verification.
 * @param launchUrl - The launch url retrieved from the Trinsic API.
 * @returns A promise that resolves with the result of the session.
 * @example
 * const sessionResult = await launchIframe('https://');
 */
export async function launchIframe(
  launchUrl: string
): Promise<TrinsicSessionResult> {
  launchUrl += "&launchMode=iframe";

  if (!launchUrl) {
    throw new Error(
      "Please specify a launch URL by calling our API via one of our backend SDKs"
    );
  }

  const existingCssLink = document.getElementById("trinsic-ui-css");
  if (!existingCssLink) {
    const cssLink = document.createElement("link");
    cssLink.href = "https://content.trinsic.id/connect/assets/widget-iframe.css";
    cssLink.rel = "stylesheet";
    cssLink.id = "trinsic-ui-css";

    document.head.appendChild(cssLink);
  }

  showModal(launchUrl);

  return new Promise<TrinsicSessionResult>((resolve, reject) => {
    window.addEventListener(
      "message",
      (event) => {
        console.debug("event data", event.data);
        if (event.data?.success === true) {
          hideModal();
          resolve(event.data as TrinsicSessionResult);
        }
        if (event.data?.success === false) {
          hideModal();
          reject(event.data as TrinsicSessionResult);
        }
      },
      false
    );
  });
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
 * @returns A promise that resolves with the result of the session.
 * @example
 * const sessionResult = await launchPopup(() => return await fetch('https://my-backend/create-session').then(res => res.json()));
 */
export async function launchPopup(
  getLaunchUrl: () => Promise<string>
): Promise<TrinsicSessionResult> {
  const userAgents = detectUserAgents();
  const popup = window.open(
    "https://api.trinsic.id/loading",
    "Trinsic",
    userAgents.isDesktop
      ? "width=600,height=900"
      : "width=" +
          window.innerWidth +
          ",height=" +
          window.innerHeight +
          ",top=0,left=0"
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

function showModal(launchUrl: string) {
  let modal = document.getElementById("trinsic-ui");

  if (modal) {
    // Modal already exists, update the iframe src
    const iframe = modal.querySelector("iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = launchUrl;
    }
  } else {
    // Create modal
    const userAgents = detectUserAgents();

    modal = document.createElement("div");
    modal.id = "trinsic-ui";
    modal.ariaHidden = "true";
    modal.className = "micromodal-slide";

    const bgOverlay = document.createElement("div");
    bgOverlay.tabIndex = -1;
    bgOverlay.className =
      "fixed inset-0 flex items-center justify-center modal__overlay";

    const modalContainer = document.createElement("div");
    modalContainer.role = "dialog";
    modalContainer.ariaModal = "true";

    modalContainer.className = userAgents.isDesktop
      ? "modal__container h-600px w-400px lock-bg shadow-lg"
      : "modal__container h-full min-h-600px w-full";

    const iframe = document.createElement("iframe");
    iframe.className = "h-full w-full bg-transparent";
    iframe.allow =
      "camera *; microphone *; display-capture *; publickey-credentials-get *; publickey-credentials-create *";
    iframe.src = launchUrl;

    modalContainer.append(iframe);
    bgOverlay.append(modalContainer);
    modal.append(bgOverlay);

    if (!document.body || !document.body.classList) {
      throw new Error(
        "document.body.classList is null or undefined. Ensure this code runs after the DOM has loaded."
      );
    }

    document.body.append(modal);

    // Initialize MicroModal only once
    if (!isMicroModalInitialized) {
      MicroModal.init();
      isMicroModalInitialized = true;
    }
  }

  document.body.classList.add("lock-bg");

  // Show the modal
  MicroModal.show("trinsic-ui");
}

function hideModal() {
  try {
    MicroModal.close("trinsic-ui");
  } catch (err) {
    console.debug("Error closing modal:", err);
  }

  document.body.classList.remove("lock-bg");

  // Remove modal from the DOM
  const modal = document.getElementById("trinsic-ui");
  if (modal) {
    modal.remove();
  }
}
