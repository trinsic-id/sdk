export interface SignalRedirectFromPopupOptions {
  /**
   * The Trinsic Session ID to signal completion for.
   */
  sessionId: string;

  /**
   * Whether to close the window after signaling completion.
   * 
   * Default value: true
   */
  closeWindowAfterSignal?: boolean;
}

/**
 * Signals to the window which opened a popup that the popup has completed its task and the session is ready.
 * 
 * This should be called by your redirect-handling page after the popup is redirected back to you by Trinsic.
 */
export function signalRedirectFromPopup(options: SignalRedirectFromPopupOptions) {
  // Construct message
  const message = {
    type: "TRINSIC_SESSION_SIGNAL",
    sessionId: options.sessionId,
  };

  // Send via BroadcastChannel first, which only works same-origin,
  // but can pierce a closed connection caused by a Cross-Origin-Opener-Policy on a page the popup visited during its journey.
  // In this way, BroadcastChannel can get the message sent in a situation where postMessage would fail.
  // Note: this will still fail to deliver, even same-origin, if the popup was opened by an iFrame which is embedded in a cross-origin page.
  const broadcastChannel = new BroadcastChannel("TrinsicSession:" + options.sessionId);
  // broadcastChannel.postMessage(message);
  broadcastChannel.close();

  // Send same message via postMessage, which works cross-origin as long as the popup has not visited a page with a Cross-Origin-Opener-Policy set.
  window.opener?.postMessage(
    message,

    // Use wildcard to allow communication between different origins
    // since the popup may be hosted on a different domain
    "*"
  );

  // Close the popup window if specified
  if (options.closeWindowAfterSignal ?? true) {
    // window.close();
  }
}