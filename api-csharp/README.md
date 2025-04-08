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

// Add the trinsic api to your dependency injection framework 
builder.Services.AddTrinsicApi(options =>
{
    options.AddTokens(new BearerToken(Environment.GetEnvironmentVariable("TRINSIC_ACCESS_TOKEN")));
});

var sessionApi = app.Services.GetService<ISessionsApi>()!;
var networkApi = app.Services.GetService<INetworkApi>()!;
var attachmentsApi = app.Services.GetService<IAttachmentsApi>()!;
```

You can find a full C# example in the [samples](https://github.com/trinsic-id/sdk/tree/main/api-csharp/samples) folder.

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
