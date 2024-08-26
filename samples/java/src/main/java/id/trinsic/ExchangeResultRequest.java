package id.trinsic;

public class ExchangeResultRequest
{
    public ExchangeResultRequest() {}

    public ExchangeResultRequest(String sessionId, String resultsAccessKey)
    {
        this.sessionId = sessionId;
        this.resultsAccessKey = resultsAccessKey;
    }

    public String sessionId;
    public String resultsAccessKey;
}
