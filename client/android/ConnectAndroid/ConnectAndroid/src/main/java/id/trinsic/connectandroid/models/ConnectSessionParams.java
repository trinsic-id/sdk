package id.trinsic.connectandroid.models;

public class ConnectSessionParams {
    private String sessionId;

    private String launchUrl;

    private String redirectScheme;

    public ConnectSessionParams(String sessionId, String launchUrl, String redirectScheme) {
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
