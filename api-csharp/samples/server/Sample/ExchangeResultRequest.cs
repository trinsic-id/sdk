public class ExchangeResultRequest
{
    public required string SessionId { get; set; }
    public required string ResultsAccessKey { get; set; }
    public string? RedirectToken { get; set; }
}
