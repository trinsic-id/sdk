using System.ComponentModel.DataAnnotations;

namespace ServiceResults;

/// <summary>
/// Standard request model for exchanging session result access keys
/// </summary>
public class ExchangeResultRequest
{
    /// <summary>
    /// The unique identifier for the verification session
    /// </summary>
    [Required]
    public string SessionId { get; set; } = string.Empty;

    /// <summary>
    /// The access key needed to retrieve session results
    /// </summary>
    [Required]
    public string ResultsAccessKey { get; set; } = string.Empty;

    /// <summary>
    /// Default constructor
    /// </summary>
    public ExchangeResultRequest() { }

    /// <summary>
    /// Constructor with parameters
    /// </summary>
    /// <param name="sessionId">The session identifier</param>
    /// <param name="resultsAccessKey">The results access key</param>
    public ExchangeResultRequest(string sessionId, string resultsAccessKey)
    {
        SessionId = sessionId;
        ResultsAccessKey = resultsAccessKey;
    }
}