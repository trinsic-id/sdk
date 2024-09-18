import { detectUserAgents } from "./detectUserAgents";
import MicroModal from "micromodal";
import { CSSString } from "./iframeCss";

export interface TrinsicSessionResult {
  success: boolean;
  msg: "user-closed" | "failed" | "complete" | "unrecoverable-error" | string;
  sessionId?: string;
  resultsAccessKey?: string;
}

export async function launchIframe(
  launchUrl: string
): Promise<TrinsicSessionResult> {
  launchUrl += "&embed=iframe";
  const style = document.createElement("style");
  style.id = "trinsic-ui-style";
  style.textContent = CSSString;
  document.head.appendChild(style);
  MicroModal.init();
  if (launchUrl === undefined || launchUrl === null || launchUrl === "") {
    throw new Error(
      "Please specify a launch url by calling our API via one of our backend SDK's"
    );
  }
  showModal(launchUrl);
  var result = new Promise<TrinsicSessionResult>((resolve, reject) => {
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
  return result;
}

export async function launchRedirect(launchUrl: string, redirectUrl: string) {
  launchUrl += "&redirectUrl=" + redirectUrl;
  window.location.href = launchUrl;
}

export async function launchPopup(
  getLaunchUrl: () => Promise<string>
): Promise<TrinsicSessionResult> {
  const userAgents = detectUserAgents();
  const popup = window.open(
    "about:blank",
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

  popup.location.href = await getLaunchUrl();

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
  removeModal();

  const userAgents = detectUserAgents();

  const modal = document.createElement("div");
  modal.id = "trinsic-ui";
  modal.ariaHidden = "true";
  modal.className = "micromodal-slide";

  const bgOverlay = document.createElement("div");
  bgOverlay.tabIndex = -1;
  // bgOverlay.setAttribute("data-micromodal-close", "true");
  bgOverlay.className = "fixed inset-0 flex items-center justify-center modal__overlay";

  const modalContainer = document.createElement("div");
  //modalContainer.role = "dialog";
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
  if (
    document === null ||
    document === undefined ||
    document.body === null ||
    document.body === undefined ||
    document.body.classList === null ||
    document.body.classList === undefined
  ) {
    throw new Error(
      "document.body.classList is null or undefined. Make sure you run this code after your DOM has loaded. You can use the event listener 'DOMContentLoaded' to ensure this."
    );
  }
  document.body.classList.add("lock-bg");
  document.body.append(modal);
  MicroModal.show("trinsic-ui");
}

function hideModal() {
  try {
    MicroModal.close("trinsic-ui");
  } catch (err) {}
  document.body.classList.remove("lock-bg");
  removeModal();
}

function removeModal() {
  const trinsicui = document.getElementById("trinsic-ui");
  trinsicui?.remove();
}
