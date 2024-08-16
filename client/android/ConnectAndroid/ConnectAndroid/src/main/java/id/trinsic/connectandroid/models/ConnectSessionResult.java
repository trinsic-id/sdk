package id.trinsic.connectandroid.models;

public class ConnectSessionResult {
    private String sessionId;

    private String resultsAccessKey;

    private boolean success;

    private boolean canceled;

    public ConnectSessionResult(String sessionId, String resultsAccessKey, boolean success, boolean canceled) {
        this.sessionId = sessionId;
        this.resultsAccessKey = resultsAccessKey;
        this.success = success;
        this.canceled = canceled;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getResultsAccessKey() {
        return resultsAccessKey;
    }

    public boolean getSuccess() {
        return success;
    }

    public boolean getCanceled() {
        return canceled;
    }
}
