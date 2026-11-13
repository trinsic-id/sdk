namespace Sample;

public interface IPersistence
{
    Task<int> SaveResultsAccessKey(Guid sessionId, string resultsAccessKey);
    Task<string> GetResultsAccessKey(Guid sessionId);
}

public class FakePersistence : IPersistence
{
    private readonly Dictionary<Guid, string> _resultAccessKeysBySessionId = new();

    public Task<int> SaveResultsAccessKey(Guid sessionId, string resultsAccessKey)
    {
        _resultAccessKeysBySessionId.Add(sessionId, resultsAccessKey);
        return Task.FromResult(1);
    }

    public Task<string> GetResultsAccessKey(Guid sessionId)
        => _resultAccessKeysBySessionId.TryGetValue(sessionId, out var resultsAccessKey)
            ? Task.FromResult(resultsAccessKey)
            : throw new KeyNotFoundException($"Did not find any entry for session {sessionId}");
}