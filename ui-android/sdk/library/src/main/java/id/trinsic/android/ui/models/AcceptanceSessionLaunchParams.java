package id.trinsic.android.ui.models;

/**
 * Internal library class used to package Acceptance Session
 */
public class AcceptanceSessionLaunchParams {
    private String sessionId;

    private String launchUrl;

    private String redirectScheme;

    public AcceptanceSessionLaunchParams(String sessionId, String launchUrl, String redirectScheme) {
        this.sessionId = sessionId;
        this.launchUrl = launchUrl;
        this.redirectScheme = redirectScheme;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getLaunchUrl() {
        return launchUrl;
    }

    public String getRedirectScheme() { return redirectScheme; }

}
