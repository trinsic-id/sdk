using System.Net;
using System.Text.Json;
using System.Text.RegularExpressions;
using Trinsic.Api.Client;

namespace Sample;

public static class ResponseExtensions
{
    public static void LogAndThrowIfError(this IApiResponse response, ILogger logger)
    {
        if (!response.IsSuccessStatusCode)
        {
            logger.LogError(
                "Error during API call to {Path}: {StatusCode} ({StatusCodeText}): {response.RawContent}",
                response.Path,
                response.StatusCode, Enum.GetName(typeof(HttpStatusCode), response.StatusCode),
                response.RawContent);
            var rawContent = response.RawContent;
            var content = JsonSerializer.Serialize(
                new
                {
                    Content = rawContent,
                    StatusCode = response.StatusCode,
                    StatusCodeText = Enum.GetName(typeof(HttpStatusCode), response.StatusCode),
                });
            throw new HttpRequestException(
               content
            );
        }
    }
}