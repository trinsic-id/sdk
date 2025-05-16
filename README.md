# Trinsic SDKs

This repository is the home of Trinsic's API (backend) and UI (frontend) libraries.

You can find our platform's documentation at [docs.trinsic.id](https://docs.trinsic.id)

## Getting started

> [!TIP]
> Each backend sample wraps the `/ui-web/samples/` sample as the frontend, including Widget, Hosted and Advanced sessions.

1. Retrieve your auth token from the Trinsic Dashboard
1. Configure it either as environment variable (`TRINSIC_ACCESS_TOKEN`) or in your backend stack's sample `.env` file.
2. Go to your preferred backend stack's sample (`/language/samples/server`) and run the backend using `start.sh`. _Note this assumes you have the toolchain working locally, inspect the `start.sh` file to see the required steps_. 
3. Explore the API and it's capabilities by navigating to [localhost:3000](http://localhost:3000). 


## API Libraries

Use these libraries in your backend to communicate with the Trinsic API.

|Language|Version|Build status|
|---|---|---|
|[`C#`](./api-csharp/)|[![C# Version](https://img.shields.io/nuget/v/Trinsic.Api)](https://www.nuget.org/packages/WorkOS.net)|[![C# Status](https://github.com/trinsic-id/sdk/actions/workflows/api-csharp-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Go`](./api-go/) | [![Go package version](https://img.shields.io/github/v/tag/trinsic-id/sdk-go-api?label=git)](https://pkg.go.dev/github.com/trinsic-id/sdk-go-api)| [![Go Status](https://github.com/trinsic-id/sdk/actions/workflows/api-go-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Java`](./api-java/) |[![Java Version](https://img.shields.io/jitpack/version/com.github.trinsic-id/sdk-java-api)](https://jitpack.io/#trinsic-id/sdk-java-api)| [![Java Status](https://github.com/trinsic-id/sdk/actions/workflows/api-java-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`PHP`](./api-php/)| [![PHP Version](https://img.shields.io/packagist/v/trinsic/api)](https://packagist.org/packages/trinsic/api)| [![PHP Status](https://github.com/trinsic-id/sdk/actions/workflows/api-php-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Python`](./api-python/)| [![Python Version](https://img.shields.io/pypi/v/trinsic-api)](https://pypi.org/project/Trinsic-Api/)| [![Python Status](https://github.com/trinsic-id/sdk/actions/workflows/api-python-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Ruby`](./api-ruby/)| [![Ruby Version](https://img.shields.io/gem/v/trinsic_api)](https://rubygems.org/gems/trinsic_api) | [![Ruby Status](https://github.com/trinsic-id/sdk/actions/workflows/api-ruby-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Typescript`](./api-typescript/) |[![TypeScript Version](https://img.shields.io/npm/v/@trinsic/api.svg)](https://www.npmjs.org/package/@trinsic/api)| [![TypeScript Status](https://github.com/trinsic-id/sdk/actions/workflows/api-typescript-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|

## UI Libraries

Use these libraries in your frontend (web or mobile app) to launch the Trinsic Flow on your user's device after [creating a Session](https://docs.trinsic.id/docs/developer-tools) using an API Library.

|Platform|Version|Build status|
|---|---|---|
|[`Android`](./ui-android/)| [![Android Version](https://img.shields.io/jitpack/version/com.github.trinsic-id/sdk-android-ui)](https://jitpack.io/#trinsic-id/sdk-java-api)| [![Android Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-android-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Expo`](./ui-expo/) |[![Expo Version](https://img.shields.io/npm/v/@trinsic/expo-ui.svg)](https://www.npmjs.org/package/@trinsic/expo-ui)| [![Expo Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-expo-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Flutter`](./ui-flutter/)| [![Flutter Version](https://img.shields.io/pub/v/trinsic_flutter_ui.svg)](https://pub.dev/packages/trinsic_flutter_ui) |[![Flutter Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-flutter-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Swift`](./ui-swift/)| [![Swift UI Version](https://img.shields.io/cocoapods/v/TrinsicUI.svg)]([https://cocoapods.org/pods/TrinsicUI](https://cocoapods.org/pods/TrinsicUI)) |[![Swift Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-swift-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|
|[`Web`](./ui-web/)| [![Web Version](https://img.shields.io/npm/v/@trinsic/web-ui.svg)](https://www.npmjs.org/package/@trinsic/web-ui) |[![Web Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-web-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)|

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
