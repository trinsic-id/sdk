import { TrinsicPopup, TrinsicPopupResult, WaitForResultsOptions } from "./TrinsicPopup";
import { detectUserAgents } from "./detectUserAgents";

export interface CreatePopupOptions {
    /**
     * The initial URL to load in the popup window.
     * 
     * By default, this points to a loading page hosted by Trinsic, on a Trinsic domain name.
     * 
     * Default value: "https://api.trinsic.id/loading"
     */
    initialUrl?: string;

    /**
     * The initial title to set for the popup window while it is loading.
     * 
     * Default value: "Trinsic"
     */
    initialWindowTitle?: string;

    /**
     * The width of the popup window, in pixels. Only applies if the user is on a desktop device.
     * 
     * Default value: 600
     */
    width?: number;

    /**
     * The height of the popup window, in pixels. Only applies if the user is on a desktop device.
     * 
     * Default value: 900
     */
    height?: number;
}

/**
 * Creates a popup window and returns a `TrinsicPopup` object to manage it and await completion.
 * 
 * Lorem ipsem
 * @param options 
 * @returns 
 */
export function createPopup(options?: CreatePopupOptions): TrinsicPopup {
    const userAgents = detectUserAgents();
    const popupWidth = options?.width || 600;
    const popupHeight = options?.height || 900;

    const left = window.screenX + (window.outerWidth - popupWidth) / 2;
    const top = window.screenY + (window.outerHeight - popupHeight) / 2;

    const popup = window.open(
        options?.initialUrl || "https://api.trinsic.id/loading",
        options?.initialWindowTitle || "Trinsic",
        userAgents.isDesktop
            ? `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
            : `width=${window.innerWidth},height=${window.innerHeight},top=0,left=0`
    );

    if (!popup) {
        throw new Error("Failed to open popup window");
    }

    return new TrinsicPopup(popup);
}


export interface CreatePopupAndWaitForResultsOptions extends CreatePopupOptions, WaitForResultsOptions {
    initializationFunction: () => Promise<string>;
}

export async function createPopupAndWaitForResults(options?: CreatePopupAndWaitForResultsOptions): Promise<TrinsicPopupResult> {
    // Create a popup window
    const popup = createPopup(options);

    // Call the initialization function to get the launch URL
    const launchUrl = await options?.initializationFunction();
    if (!launchUrl) {
        throw new Error("Launch URL is empty");
    }

    // Initialize the popup with the launch URL
    popup.initialize(launchUrl);

    return popup.waitForCompletion(options);
}