using Trinsic.Api.Api;
using Trinsic.Api.Model;
using Trinsic.Api.Extensions;
using Microsoft.Extensions.Logging;
using Sample;

namespace ServiceResults;

/// <summary>
/// Service for exchanging result access keys and retrieving session results
/// </summary>
public class ResultExchanger
{
    private readonly ISessionsApi _sessionsApi;
    private readonly ILogger? _logger;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="sessionsApi">The Trinsic sessions API instance</param>
    /// <param name="logger">Optional logger for error handling</param>
    public ResultExchanger(ISessionsApi sessionsApi, ILogger? logger = null)
    {
        _sessionsApi = sessionsApi ?? throw new ArgumentNullException(nameof(sessionsApi));
        _logger = logger;
    }

    /// <summary>
    /// Exchange a result access key for the actual session results
    /// </summary>
    /// <param name="request">The exchange request containing session ID and access key</param>
    /// <returns>The session result</returns>
    /// <exception cref="ArgumentNullException">Thrown when request is null</exception>
    /// <exception cref="ValidationException">Thrown when request validation fails</exception>
    public async Task<object> ExchangeResultAsync(ExchangeResultRequest request)
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
        if (_logger != null)
        {
            response.LogAndThrowIfError(_logger);
        }
        else if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"API call failed: {response.StatusCode}");
        }

        return response.Ok();
    }

    /// <summary>
    /// Exchange a result access key and return the unwrapped result
    /// </summary>
    /// <param name="request">The exchange request</param>
    /// <returns>The unwrapped session result data</returns>
    public async Task<object> ExchangeResultDataAsync(ExchangeResultRequest request)
    {
        return await ExchangeResultAsync(request);
    }
}