# Trinsic API C# Library

[![Version](https://img.shields.io/nuget/v/Trinsic.Api)](https://www.nuget.org/packages/WorkOS.net)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/api-csharp-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic API C# library provides convenient access to the Trinsic API from applications written in C#.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

### Via the NuGet Package Manager

```sh
nuget install Trinsic.Api
```

### Via the .NET Core Command Line Tools

```sh
dotnet add package Trinsic.Api
```

## Usage

The package needs to be configured with your app's access token, which is
available in the [Trinsic Dashboard](https://dashboard.trinsic.id).

```cs
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Model;

using var httpClient = new HttpClient();
using var sessions = new SessionsApi(httpClient, new Configuration
{
    AccessToken = Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN")
});

var result = await sessions.GetSessionResultAsync(
    sessionId,
    new GetSessionResultRequest { ResultsAccessKey = resultsAccessKey });

// Successful calls return models directly. HTTP errors throw ApiException,
// which exposes ErrorCode (HTTP status) and ErrorContent (response body).
var identity = result.IdentityData;
```

The [C# sample](samples/server) shows registration with `AddHttpClient`, dependency
injection into request handlers, and `ApiException` handling. Construct models
with object initializers, as shown above.

### Data residency

By default, the SDK communicates with `https://api.trinsic.id`. For a Verification
Profile configured for EU data residency, set `Configuration.BasePath` when
constructing the client:

```cs
var configuration = new Configuration
{
    AccessToken = Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN"),
    BasePath = "https://api.eu.trinsic.id"
};
using var sessions = new SessionsApi(httpClient, configuration);
```

### JSON serialization

The SDK uses Newtonsoft.Json attributes for wire property names, enum strings,
and nested JSON. Generated `ToJson()` methods exclude read-only properties for
request serialization. When forwarding responses to a browser, the sample's
`SdkJson.Result` helper includes those read-only fields and returns
`application/json` content.

Nullable dates deserialize to `DateOnly?`. An omitted nullable property is emitted
as explicit null when reserialized. Timestamp-looking strings inside free-form
JSON remain strings. Untyped floating point values inside free-form JSON use
`double` precision and may round high-precision numbers; they are not stored as
lossless JSON number tokens. The SDK does not globally force decimal parsing,
which would reject valid numbers outside the decimal range.

### Unknown enum values

The API can add enum values after this SDK version was released. A value this
version does not know is read as the enum's `UnknownDefaultOpenApi` member
instead of failing the response:

```csharp
if (session.ErrorCode == SessionErrorCode.UnknownDefaultOpenApi)
{
    // An error code newer than this SDK version.
}
```

Upgrade the SDK to read the new value. Do not send the fallback member in
requests; the API does not accept it.

## SDK Versioning

Our SDKs follow the [Semantic Versioning](https://semver.org) ("SemVer") scheme. 

For example, the version number `1.13.0` has a major version of `1`, a minor version of `13`, and a patch version of `0`.

Breaking changes are only introduced alongside a new major version.

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
