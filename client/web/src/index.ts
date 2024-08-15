import { detectUserAgents } from "./detectUserAgents";
import MicroModal from "micromodal";
import { CSSString } from "./iframeCss";

export class ConnectClient {
  constructor() {}

  public async launchIframe(launchUrl: string) {
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
    this.showModal(launchUrl);
    var result = new Promise((resolve, reject) => {
      window.addEventListener(
        "message",
        (event) => {
          console.debug("event data", event.data);
          if (event.data?.success === true) {
            this.hideModal();
            resolve(event.data);
          }
          if (event.data?.success === false) {
            this.hideModal();
            reject(event.data);
          }
        },
        false
      );
    });
    return result;
  }
  public async launchRedirect(launchUrl: string) {}
  public async launchPopup(launchUrl: string) {}

  private showModal(launchUrl: string) {
    this.removeModal();

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

  private hideModal() {
    try {
      MicroModal.close("trinsic-connect");
    } catch (err) {}
    document.body.classList.remove("lock-bg");
    this.removeModal();
  }

  private removeModal() {
    const trinsicConnect = document.getElementById("trinsic-connect");
    trinsicConnect?.remove();
  }
}
