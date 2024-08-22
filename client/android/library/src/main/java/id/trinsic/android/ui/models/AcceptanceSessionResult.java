package id.trinsic.android.ui.models;

/**
 * The result of executing a Session via `TrinsicClient.Invoke()`
 */
public class AcceptanceSessionResult {
    private String sessionId;

    private String resultsAccessKey;

    private boolean success;

    private boolean canceled;

    public AcceptanceSessionResult(String sessionId, String resultsAccessKey, boolean success, boolean canceled) {
        this.sessionId = sessionId;
        this.resultsAccessKey = resultsAccessKey;
        this.success = success;
        this.canceled = canceled;
    }

    /**
     * The ID of the Acceptance Session this result is for
     */
    public String getSessionId() {
        return sessionId;
    }

    /**
     * The Results Access Key, if any, which can be used to access the session results.
     * <br/><br/>
     * This should be sent to your backend, which can then pass it to the `/results/exchange` API endpoint to fetch the final identity
     * data for this Session.
     */
    public String getResultsAccessKey() {
        return resultsAccessKey;
    }

    /**
     * Whether the Session was successful
     */
    public boolean getSuccess() {
        return success;
    }

    /**
     * Whether the Session was explicitly canceled by the user (eg by hitting their back button)
     */
    public boolean getCanceled() {
        return canceled;
    }
}
