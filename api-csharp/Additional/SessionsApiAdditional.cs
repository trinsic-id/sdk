using System;
using Trinsic.Api.Client;

namespace Trinsic.Api.Api;

public partial interface ISessionsApi
{
    /// <summary>
    /// Sets the auth token used for all requests made by this client.
    /// </summary>
    public void SetAuthToken(string token);
}

public partial class SessionsApi
{
    public void SetAuthToken(string token)
    {
        if (BearerTokenProvider is not ConstantTokenProvider<BearerToken> constantProvider)
        {
            throw new Exception("SetAuthToken() cannot be called if you are not using the ConstantTokenProvider.");
        }

        constantProvider._token = new BearerToken(token);
    }
}
