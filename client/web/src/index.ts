import { detectUserAgents } from "./detectUserAgents";
import MicroModal from "micromodal";
import { CSSString } from "./iframeCss";

export interface ConnectSessionResult {
  success: boolean;
  msg: "user-closed" | "failed" | "complete" | "unrecoverable-error" | string;
  sessionId?: string;
  resultsAccessKey?: string;
}

export async function launchIframe(
  launchUrl: string
): Promise<ConnectSessionResult> {
  launchUrl += "&embed=iframe";
  const style = document.createElement("style");
  style.id = "trinsic-connect-style";
  style.textContent = CSSString;
  document.head.appendChild(style);
  MicroModal.init();
  if (launchUrl === undefined || launchUrl === null || launchUrl === "") {
    throw new Error(
      "Please specify a launch url by calling our API via one of our backend SDK's"
    );
  }
  showModal(launchUrl);
  var result = new Promise<ConnectSessionResult>((resolve, reject) => {
    window.addEventListener(
      "message",
      (event) => {
        console.debug("event data", event.data);
        if (event.data?.success === true) {
          hideModal();
          resolve(event.data as ConnectSessionResult);
        }
        if (event.data?.success === false) {
          hideModal();
          reject(event.data as ConnectSessionResult);
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
  launchUrl: string
): Promise<ConnectSessionResult> {
  const userAgents = detectUserAgents();
  const popup = window.open(
    launchUrl,
    "Trinsic Connect",
    userAgents.isDesktop
      ? "width=600,height=900"
      : "width=" +
          window.innerWidth +
          ",height=" +
          window.innerHeight +
          ",top=0,left=0"
  );
  var result = new Promise<ConnectSessionResult>((resolve, reject) => {
    window?.addEventListener(
      "message",
      (event) => {
        console.debug("event data", event.data);
        if (event.data?.success === true) {
          popup?.close();
          resolve(event.data as ConnectSessionResult);
        }
        if (event.data?.success === false) {
          popup?.close();
          reject(event.data as ConnectSessionResult);
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
  modal.id = "trinsic-connect";
  modal.ariaHidden = "true";
  modal.className = "micromodal-slide";

  const bgOverlay = document.createElement("div");
  bgOverlay.tabIndex = -1;
  // bgOverlay.setAttribute("data-micromodal-close", "true");
  bgOverlay.className = "fixed inset-0 flex items-center justify-center";

  const modalContainer = document.createElement("div");
  //modalContainer.role = "dialog";
  modalContainer.ariaModal = "true";

  modalContainer.className = userAgents.isDesktop
    ? "modal__container h-600px w-400px lock-bg"
    : "modal__container h-full min-h-600px w-full";

  const iframe = document.createElement("iframe");
  iframe.className = "h-full w-full bg-transparent";
  iframe.allow =
    "camera *; microphone *; display-capture *; publickey-credentials-get *; publickey-credentials-create *";
  iframe.src = launchUrl;

  modalContainer.append(iframe);
  bgOverlay.append(modalContainer);
  modal.append(bgOverlay);
  document.body.classList.add("lock-bg");
  document.body.append(modal);
  MicroModal.show("trinsic-connect");
}

function hideModal() {
  try {
    MicroModal.close("trinsic-connect");
  } catch (err) {}
  document.body.classList.remove("lock-bg");
  removeModal();
}

function removeModal() {
  const trinsicConnect = document.getElementById("trinsic-connect");
  trinsicConnect?.remove();
}
