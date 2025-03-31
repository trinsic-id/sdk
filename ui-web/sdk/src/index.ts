import { detectUserAgents } from "./detectUserAgents";
import MicroModal from "micromodal";

export interface TrinsicSessionResult {
  success: boolean;
  msg: "user-closed" | "failed" | "complete" | "unrecoverable-error" | string;
  sessionId?: string;
  resultsAccessKey?: string;
}

let isMicroModalInitialized = false;

export async function launchIframe(
  launchUrl: string
): Promise<TrinsicSessionResult> {
  launchUrl += "&launchMode=iframe";
  const cssLink = document.createElement("link");
  cssLink.href = "https://content.trinsic.id/connect/assets/widget-iframe.css";
  cssLink.rel = "stylesheet";
  cssLink.id = "trinsic-ui-css";

  document.head.appendChild(cssLink);

  if (!launchUrl) {
    throw new Error(
      "Please specify a launch URL by calling our API via one of our backend SDKs"
    );
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

export async function launchRedirect(launchUrl: string) {
  launchUrl += "&launchMode=redirect";
  window.location.href = launchUrl;
}

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

  let launchUrl = await getLaunchUrl();
  if (!launchUrl) {
    throw new Error("Invalid launch URL " + launchUrl);
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
    console.error("Error closing modal:", err);
  }

  document.body.classList.remove("lock-bg");

  // Remove modal from the DOM
  const modal = document.getElementById("trinsic-ui");
  if (modal) {
    modal.remove();
  }
}
