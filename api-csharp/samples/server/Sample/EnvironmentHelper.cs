namespace Sample;

public static class EnvironmentHelper
{
    public static string GetAuthTokenOrThrow()
    {
        return Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN") ?? throw new Exception("TRINSIC_ACCESS_TOKEN environment variable not set.");
    }

    public static Guid GetVerificationProfileIdOrThrow()
    {
        var profileId = Environment.GetEnvironmentVariable("TRINSIC_VERIFICATION_PROFILE_ID") ?? throw new Exception("TRINSIC_VERIFICATION_PROFILE_ID environment variable not set.");
        if (Guid.TryParse(profileId, out var typedProfileId))
        {
            return typedProfileId;
        }
        throw new Exception("TRINSIC_VERIFICATION_PROFILE_ID environment variable is not a valid GUID.");
    }
}