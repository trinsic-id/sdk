export class TrinsicPopup {
    protected readonly popup: Window;
    protected launchUrl?: string;
    protected sessionId?: string;

    private _messageListener?: (event: MessageEvent) => void;
    private _broadcastChannel?: BroadcastChannel;
    private _hasInitialized: boolean = false;
    private _hasDisposed: boolean = false;
    private _hasReceivedFinalizationSignal: boolean = false;
    private _pollingIndicatedSuccess: boolean = false;

    constructor(popup: Window) {
        this.popup = popup;
    }

    /**
     * Whether the popup window is definitely still open.
     * 
     * This may return false negatives (i.e., this function may return "false" even if the window is still open).
     * This is because the `Cross-Origin-Opener-Policy` security header, if set on any page a popup visits (e.g. an Identity Provider's page), will
     * cause the browser to sever the connection an opening window has to the popup, making it impossible to check if it's closed.
     * 
     * If this functions returns `true`, the popup window is open.
     * If this function returns `false`, the popup window MAY be closed. Offer the user the opportunity to cancel out of the Session, but do not automatically do so.
     */
    get isDefinitelyOpen() {
        return this.popup && !this.popup.closed;
    }

    /**
     * Whether we have received a message from the popup window indicating the session is complete.
     * 
     * NOTE: If this popup was launched from within an iFrame, then cross-origin restrictions may prevent cross-window messages from working in all instances.
     *       To support launching from an iFrame, use the `pollFunction` option on `initializeAndWaitForResult()`.
     */
    get hasReceivedFinalizationSignal() {
        return this._hasReceivedFinalizationSignal;
    }

    /**
     * Disposes the popup, closing the window if it's still open.
     * @returns 
     */
    dispose() {
        if (this._hasDisposed) return;
        if (this.isDefinitelyOpen) {
            try {
                this.popup.close();
            } catch (error) {
            }
        }

        this.unbindEventListeners();
        this._hasDisposed = true;
    }

    private unbindEventListeners() {
        if (this._messageListener) {
            window.removeEventListener("message", this._messageListener);
            this._messageListener = undefined;
        }

        if (this._broadcastChannel) {
            this._broadcastChannel.onmessage = null;
            this._broadcastChannel.close();
            this._broadcastChannel = undefined;
        }
    }

    /**
     * Initialize the popup with the given launch URL.
     * 
     * @param launchUrl A `launchUrl`, retrieved from Trinsic's API, delivered to your frontend through your backend.
     */
    initialize(launchUrl: string) {
        // Validate state
        if (this._hasInitialized) {
            throw new Error("Popup has already been initialized");
        }
        if (!this.isDefinitelyOpen) {
            throw new Error("Call to initialize() failed because popup window is closed or inaccessible");
        }

        // Do the initialization and close the popup if it fails
        try {
            this._innerInitialize(launchUrl);
        } catch (error) {
            try {
                this.popup?.close();
            } catch (disposeError) {
                console.debug("Error disposing popup after failed initialization", disposeError);
            }
            throw error;
        }
    }

    /**
     * Wait for the popup session to complete through one of the following mechanisms:
     * 
     * - A direct cross-window message from the popup window
     * - A polling function which regularly hits your backend to determine if the session is complete
     * - A maximum timeout is reached
     * 
     * When this function resolves, you should communicate with your backend to fetch the final session results.
     */
    async waitForCompletion(options?: WaitForResultsOptions): Promise<TrinsicPopupResult> {
        // Validate state
        if (!this._hasInitialized) {
            throw new Error("Popup has not been initialized");
        }

        if (this._hasDisposed) {
            throw new Error("Popup has been disposed");
        }

        // If we're in an iFrame, ensure we have a polling function
        if (window.self !== window.top) {
            if (!options?.pollingFunction) {
                throw new Error("You must provide a value for `pollingFunction` when running inside an iFrame");
            }
        }

        // If we have a polling function, validate interval
        const pollIntervalMs = options?.pollingIntervalMs || 2000;
        if (options?.pollingFunction && pollIntervalMs < 500) {
            throw new Error("You must provide a value of at least 500 milliseconds for `pollingIntervalMs`");
        }

        // If we have `onPollError`, we have to have a polling function
        if (options?.onPollError && !options.pollingFunction) {
            throw new Error("You must provide a value for `pollingFunction` if you provide `onPollError`");
        }

        // If we have a timeout, validate it
        if (options?.timeoutMs && options.timeoutMs < 30000) {
            throw new Error("You must provide a value of at least 30000 milliseconds (30 seconds) for `timeoutMs`");
        }

        // Return a promise which resolves when the session is complete
        return new Promise<TrinsicPopupResult>((resolve, reject) => {
            let timeoutHandle: any = null;
            let pollIntervalHandle: any = null;
            let pollInMemoryHandle: any = null;
            let hasCalledMaybeClosed = false;

            // Function to clean up event listeners and timers
            const cleanupAndResolve = (code: TrinsicPopupResultCode) => {
                if (timeoutHandle) {
                    clearTimeout(timeoutHandle);
                    timeoutHandle = null;
                }

                if (pollIntervalHandle) {
                    clearInterval(pollIntervalHandle);
                    pollIntervalHandle = null;
                }

                if (pollInMemoryHandle) {
                    clearInterval(pollInMemoryHandle);
                    pollInMemoryHandle = null;
                }

                resolve({
                    sessionId: this.sessionId!,
                    code: code
                });
            };

            // If we have a timeout, set it up
            if (options?.timeoutMs) {
                timeoutHandle = setTimeout(() => {
                    cleanupAndResolve(TrinsicPopupResultCode.TimeoutElapsed);
                }, options.timeoutMs);
            }

            // If we have a polling function, set up the interval
            if (options?.pollingFunction) {
                pollIntervalHandle = setInterval(async () => {
                    // Don't poll if we've been disposed
                    if (this._hasDisposed) {
                        return;
                    }

                    // Perform a poll
                    try {
                        const isComplete = this._pollingIndicatedSuccess || await options.pollingFunction!();
                        if (isComplete) {
                            cleanupAndResolve(TrinsicPopupResultCode.PollingFunctionIndicatedCompletion);
                        }
                    } catch (error) {
                        if (options?.onPollError) {
                            const shouldContinue = options.onPollError(error);
                            if (!shouldContinue) {
                                cleanupAndResolve(TrinsicPopupResultCode.PollingError);
                            }
                        }
                    }
                }, pollIntervalMs);
            }

            // Set up an interval to poll for A) the signal from the popup having been received, B) the popup being closed or C) the TrinsicPopup being disposed
            pollInMemoryHandle = setInterval(() => {
                // Poll for disposal
                if (this._hasDisposed) {
                    cleanupAndResolve(TrinsicPopupResultCode.PopupDisposed);
                }

                // Poll for popup having been closed
                if (options?.onWindowMaybeClosed && !this.isDefinitelyOpen && !hasCalledMaybeClosed) {
                    hasCalledMaybeClosed = true;
                    options.onWindowMaybeClosed!();
                }

                // Poll for having received the finalization signal
                if (this._hasReceivedFinalizationSignal) {
                    cleanupAndResolve(TrinsicPopupResultCode.SignalReceived);
                }
            }, 100);
        });
    }

    private _innerInitialize(launchUrl: string) {
        // Parse launch URL
        const url = new URL(launchUrl);

        // Extract session ID and validate that it's a GUID
        if (!url.searchParams.has("sessionId")) {
            throw new Error("Launch URL is missing sessionId parameter");
        }

        const urlSessionId = url.searchParams.get("sessionId");
        if (!urlSessionId || !urlSessionId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
            throw new Error("Launch URL has empty or invalid sessionId parameter");
        }

        // Ensure launch URL has `popup` launch mode
        url.searchParams.set("launchMode", "popup");
        const finalLaunchUrl = url.toString();

        // Try to navigate popup to launch URL
        try {
            this.popup.location.href = finalLaunchUrl;
        } catch (error) {
            throw new Error("Call to initialize() failed because popup window location could not be modified");
        }

        // Set up message listeners
        this._broadcastChannel = new BroadcastChannel("TrinsicSession:" + urlSessionId);
        this._broadcastChannel.onmessage = (event) => {
            if (event.data?.sessionId !== this.sessionId) return; // Ignore messages not for our session
            if (event.data?.type !== "TRINSIC_SESSION_SIGNAL" || event.data?.sessionId !== this.sessionId) return; // Ignore messages not for our session
            if (this._hasReceivedFinalizationSignal) return; // Debounce multiple messages

            this._hasReceivedFinalizationSignal = true;
            this.unbindEventListeners();
        };

        this._messageListener = (event: MessageEvent) => {
            if (event.source !== this.popup) return; // Ignore messages not from our popup
            if (event.data?.type !== "TRINSIC_SESSION_SIGNAL" || event.data?.sessionId !== this.sessionId) return; // Ignore messages not for our session
            if (this._hasReceivedFinalizationSignal) return; // Debounce multiple messages

            this._hasReceivedFinalizationSignal = true;
            this.unbindEventListeners();
        };
        window.addEventListener("message", this._messageListener);

        // We're initialized
        this.sessionId = urlSessionId;
        this.launchUrl = finalLaunchUrl;
        this._hasInitialized = true;
    }
}

export interface WaitForResultsOptions {
    /** A function which is called when the popup window is detected to *perhaps* be closed.
     * 
     * NOTE: Due to browser security restrictions and new security headers such as `Cross-Origin-Opener-Policy`, it may be possible
     * that this function is called even if the popup window is still open. This can occur if the popup navigates to an Identity Provider's page
     * which sets a restrictive `Cross-Origin-Opener-Policy` header, which severs the connection between the opener window and the popup window.
     * 
     * Therefore, this function should be used to offer the user the opportunity to cancel out of the session, but should NOT automatically cancel the session.
     * For example, you might modify a background "spinning" indicator or modal to include a "Cancel" button, or show an "Are you still working?" prompt.
     */
    onWindowMaybeClosed?: () => void;

    /**
     * A function which polls your backend to determine if the session is complete. Return `true` if the session is complete, `false` otherwise.
     * 
     * Required if your code is running inside of an iFrame whose origin is different from its embedding page's origin.
     * 
     * This is necessary because certain circumstances could cause cross-window messaging to be blocked by the browser when running inside a cross-origin iFrame.
     */
    pollingFunction?: () => Promise<boolean>;

    /**
     * A function which is called when an error occurs in the polling function.
     * 
     * Return `true` to ignore the error and continue polling, or `false` to stop polling in response to the error.
     */
    onPollError?: (error: any) => boolean;

    /**
     * How often, in milliseconds, to call the `pollingFunction` if one is provided.
     * 
     * Default value: 2000 (2 seconds)
     */
    pollingIntervalMs?: number;

    /**
     * How long, in milliseconds, to wait for the session to complete before rejecting the promise.
     * 
     * Default value: undefined (no timeout)
     */
    timeoutMs?: number;
}

export interface TrinsicPopupResult {
    /**
     * The Session ID this result is for.
     */
    sessionId: string;

    /**
     * The code associated with this result.
     */
    code: TrinsicPopupResultCode;
}

export enum TrinsicPopupResultCode {
    /**
     * The post-redirect signal was received from the popup window, indicating the Session was completed.
     */
    SignalReceived = "SignalReceived",

    /**
     * The polling function provided by the caller indicated the Session was completed.
     */
    PollingFunctionIndicatedCompletion = "PollingFunctionIndicatedCompletion",

    /**
     * The polling function provided by the caller encountered an error, and the `onPollError` function subsequently returned `false`, indicating polling should stop.
     */
    PollingError = "PollingError",

    /**
     * The specified timeout elapsed before the Session was completed.
     */
    TimeoutElapsed = "TimeoutElapsed",

    /**
     * The dispose() function on the TrinsicPopup instance was called, which caused all pending waitForCompletion() calls to resolve with this code.
     */
    PopupDisposed = "PopupDisposed"
}