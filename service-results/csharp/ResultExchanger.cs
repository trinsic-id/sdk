using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace ServiceResults;

/// <summary>
/// Service for exchanging result access keys and retrieving session results
/// </summary>
public class ResultExchanger
{
    private readonly ISessionsApi _sessionsApi;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="sessionsApi">The Trinsic sessions API instance</param>
    public ResultExchanger(ISessionsApi sessionsApi)
    {
        _sessionsApi = sessionsApi ?? throw new ArgumentNullException(nameof(sessionsApi));
    }

    /// <summary>
    /// Exchange a result access key for the actual session results
    /// </summary>
    /// <param name="request">The exchange request containing session ID and access key</param>
    /// <returns>The session result</returns>
    /// <exception cref="ArgumentNullException">Thrown when request is null</exception>
    /// <exception cref="ValidationException">Thrown when request validation fails</exception>
    public async Task<GetSessionResultResponse> ExchangeResultAsync(ExchangeResultRequest request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        // Validate the request
        ResultProcessor.ValidateRequest(request);

        // Create the API request
        var apiRequest = new GetSessionResultRequest(request.ResultsAccessKey);

        // Call the API
        var response = await _sessionsApi.GetSessionResultAsync(request.SessionId, apiRequest);
        
        // Check for errors and throw if needed
        response.LogAndThrowIfError();

        return response;
    }

    /// <summary>
    /// Exchange a result access key and return the unwrapped result
    /// </summary>
    /// <param name="request">The exchange request</param>
    /// <returns>The unwrapped session result data</returns>
    public async Task<GetSessionResult> ExchangeResultDataAsync(ExchangeResultRequest request)
    {
        var response = await ExchangeResultAsync(request);
        return response.Ok();
    }
}