using System.ComponentModel.DataAnnotations;
using Trinsic.Api.Model;

namespace ServiceResults;

/// <summary>
/// Utility class for processing and validating session results
/// </summary>
public static class ResultProcessor
{
    /// <summary>
    /// Validates an ExchangeResultRequest
    /// </summary>
    /// <param name="request">The request to validate</param>
    /// <exception cref="ArgumentNullException">Thrown when request is null</exception>
    /// <exception cref="ValidationException">Thrown when validation fails</exception>
    public static void ValidateRequest(ExchangeResultRequest request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(request);

        if (!Validator.TryValidateObject(request, validationContext, validationResults, true))
        {
            var errors = string.Join(", ", validationResults.Select(vr => vr.ErrorMessage));
            throw new ValidationException($"Request validation failed: {errors}");
        }

        // Additional custom validations
        if (string.IsNullOrWhiteSpace(request.SessionId))
            throw new ValidationException("SessionId cannot be null or empty");

        if (string.IsNullOrWhiteSpace(request.ResultsAccessKey))
            throw new ValidationException("ResultsAccessKey cannot be null or empty");

        // Validate SessionId format (should be a valid GUID)
        if (!Guid.TryParse(request.SessionId, out _))
            throw new ValidationException("SessionId must be a valid GUID");
    }

    /// <summary>
    /// Processes a session result and extracts common information
    /// </summary>
    /// <param name="result">The session result to process</param>
    /// <returns>Processed result information</returns>
    public static ProcessedResult ProcessSessionResult(GetSessionResult result)
    {
        if (result == null)
            throw new ArgumentNullException(nameof(result));

        return new ProcessedResult
        {
            SessionId = result.Session?.Id,
            State = result.Session?.State?.ToString(),
            FailCode = result.Session?.FailCode?.ToString(),
            FailReason = result.Session?.FailReason,
            ResultCount = result.Session?.Result?.Count ?? 0,
            HasVerifications = result.Session?.Result?.Any() == true,
            CompletedAt = result.Session?.UpdatedAt
        };
    }
}

/// <summary>
/// Represents processed session result information
/// </summary>
public class ProcessedResult
{
    public string? SessionId { get; set; }
    public string? State { get; set; }
    public string? FailCode { get; set; }
    public string? FailReason { get; set; }
    public int ResultCount { get; set; }
    public bool HasVerifications { get; set; }
    public DateTime? CompletedAt { get; set; }
}