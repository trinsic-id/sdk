# Trinsic SDKs

This repository is the home of Trinsic's API (backend) and UI (frontend) libraries.

You can find our platform's documentation at [docs.trinsic.id](https://docs.trinsic.id)

## Getting started

> [!TIP]
> Each backend sample wraps the `/ui-web/samples/` sample as the frontend, including Hosted and Direct sessions.

1. Retrieve your auth token and a verification profile ID from the Trinsic Dashboard
1. Configure `localhost:3000` as an approved redirect url in your app's settings in the dashboard.
1. Configure it either as environment variable (`TRINSIC_ACCESS_TOKEN` and `TRINSIC_VERIFICATION_PROFILE_ID`) or in your backend stack's sample `.env` file.
1. Go to your preferred backend stack's sample (`/language/samples/server`) and run the backend using `start.sh`. _Note this assumes you have the toolchain working locally, inspect the `start.sh` file to see the required steps_.
1. Explore the API and it's capabilities by navigating to [localhost:3000](http://localhost:3000).

## API Libraries

Use these libraries in your backend to communicate with the Trinsic API.

| Language                          | Version                                                                                                                                           | Build status                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`C#`](./api-csharp/)             | [![C# Version](https://img.shields.io/nuget/v/Trinsic.Api)](https://www.nuget.org/packages/WorkOS.net)                                            | [![C# Status](https://github.com/trinsic-id/sdk/actions/workflows/api-csharp-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)             |
| [`Go`](./api-go/)                 | [![Go package version](https://img.shields.io/github/v/tag/trinsic-id/sdk-go-api?label=git)](https://pkg.go.dev/github.com/trinsic-id/sdk-go-api) | [![Go Status](https://github.com/trinsic-id/sdk/actions/workflows/api-go-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)                 |
| [`Java`](./api-java/)             | [![Java Version](https://img.shields.io/jitpack/version/com.github.trinsic-id/sdk-java-api)](https://jitpack.io/#trinsic-id/sdk-java-api)         | [![Java Status](https://github.com/trinsic-id/sdk/actions/workflows/api-java-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)             |
| [`Python`](./api-python/)         | [![Python Version](https://img.shields.io/pypi/v/trinsic-api)](https://pypi.org/project/Trinsic-Api/)                                             | [![Python Status](https://github.com/trinsic-id/sdk/actions/workflows/api-python-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)         |
| [`Ruby`](./api-ruby/)             | [![Ruby Version](https://img.shields.io/gem/v/trinsic_api)](https://rubygems.org/gems/trinsic_api)                                                | [![Ruby Status](https://github.com/trinsic-id/sdk/actions/workflows/api-ruby-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)             |
| [`Typescript`](./api-typescript/) | [![TypeScript Version](https://img.shields.io/npm/v/@trinsic/api.svg)](https://www.npmjs.org/package/@trinsic/api)                                | [![TypeScript Status](https://github.com/trinsic-id/sdk/actions/workflows/api-typescript-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main) |

## UI Libraries

Use these libraries in your frontend (web or mobile app) to launch the Trinsic Flow on your user's device after [creating a Session](https://docs.trinsic.id/docs/developer-tools) using an API Library.

| Platform                   | Version                                                                                                                                                 | Build status                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Android`](./ui-android/) | [![Android Version](https://img.shields.io/jitpack/version/com.github.trinsic-id/sdk-android-ui)](https://jitpack.io/#trinsic-id/sdk-java-api)          | [![Android Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-android-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main) |
| [`Expo`](./ui-expo/)       | [![Expo Version](https://img.shields.io/npm/v/@trinsic/expo-ui.svg)](https://www.npmjs.org/package/@trinsic/expo-ui)                                    | [![Expo Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-expo-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)       |
| [`Flutter`](./ui-flutter/) | [![Flutter Version](https://img.shields.io/pub/v/trinsic_flutter_ui.svg)](https://pub.dev/packages/trinsic_flutter_ui)                                  | [![Flutter Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-flutter-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main) |
| [`Swift`](./ui-swift/)     | [![Swift UI Version](https://img.shields.io/github/v/tag/trinsic-id/sdk-swift-ui?label=git)](https://github.com/trinsic-id/sdk-swift-ui/tags) | [![Swift Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-swift-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)     |
| [`Web`](./ui-web/)         | [![Web Version](https://img.shields.io/npm/v/@trinsic/web-ui.svg)](https://www.npmjs.org/package/@trinsic/web-ui)                                       | [![Web Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-web-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)         |

## SDK Versioning

Our SDKs follow the [Semantic Versioning](https://semver.org) ("SemVer") scheme.

For example, the version number `1.13.0` has a major version of `1`, a minor version of `13`, and a patch version of `0`.

Breaking changes are only introduced alongside a new major version.

## API SDK identification

Every generated API SDK automatically sends `X-Trinsic-SDK: <language>/<version>`
with its requests, for example `X-Trinsic-SDK: python/3.2.1`. Language identifiers
are `csharp`, `go`, `java`, `python`, `ruby`, and `typescript`. The version is
the SDK package version from `versions.json`, including any prerelease suffix.
No client configuration is required, and existing authentication and application
headers are preserved.

`helpers/generate-client.sh` applies the request additions using
`helpers/inject-sdk-header.mjs` after generation, so they survive every rebuild.
The patches target the generator libraries and package layouts configured in
`api-*/build-sdk.sh` and fail the build if an expected injection point is missing.
When upgrading OpenAPI Generator or changing those configurations, check the
injection points against its generated request code. This applies to the six
generated API SDKs; the UI libraries have a separate build process.

After building an SDK, run `SDK_LANGUAGE=python npm run test:sdk-headers`
(substitute its language identifier). With all six SDKs
built and their toolchains installed, `npm run test:sdk-headers` runs the full
suite. These tests send requests only to a local HTTP server and verify SDK
identity alongside authentication and custom headers. Each API build workflow
runs its language's tests before publishing.

## SDK release contract tests

This branch contains [contract tests pinned to published SDK 3.2.1](scripts/sdk-compatibility/README.md).
Connect selects the test snapshot commits and owns all compatibility exceptions.

## Named model construction

The next major API SDK release prevents schema changes from silently rebinding
positional model fields. C# uses object initializers with required writable
properties; Go uses keyed structs or named setters; Java uses no-argument
constructors and named setters, with private Jackson constructors for read-only
fields. Python keyword models and Ruby attribute hashes retain their existing
behavior. TypeScript models remain interfaces, and endpoint calls now take one
object containing named endpoint parameters.

These are breaking source changes. Package versions have not been advanced for
release yet. See each API SDK's README for migration examples and
[the template notes](templates/README.md) for the generator overrides. Client
configuration constructors and endpoint methods outside TypeScript retain their
existing calling conventions.

Template changes are maintained as patches against the checksum-pinned generator.
`npm run templates:check` detects drift; the template notes describe staging and
reviewing upgrades with `templates:upgrade` and `templates:accept`.

After building an API SDK, run
`SDK_LANGUAGE=csharp npm run test:sdk-construction` (or `go`, `java`,
`python`, `ruby`, `typescript`). With all six built, `npm run test:sdk-construction`
runs them together. The checks compile or run valid consumers, require unsafe
calls to fail, and verify JSON behavior without calling the Trinsic API. Each
API build workflow runs its checks. The published 3.2.1 contract-test
snapshot remains unchanged.

## Unknown enum values

The API can add enum values after an SDK version is released. API SDKs read a
value they do not know instead of failing the whole response. C#, Go, Java,
Python, and Ruby are generated with `enumUnknownDefaultCase=true`, which adds a
fallback member with the wire value `unknown_default_open_api` to every enum,
and read unknown values as that member. Go, Java, and Ruby get this from the
generator; C# and Python need [template patches](templates/README.md) because
their generators add the member without using it. TypeScript needs neither: its
models already return an unknown value as the original string.

The fallback member is for reading only; the API does not accept it in requests.
Where an SDK converts strings to enums, such as Java's `fromValue` or Python
model fields, a misspelled value now also becomes the fallback member instead of
raising an error.

After building an API SDK, run
`SDK_LANGUAGE=csharp npm run test:sdk-unknown-enums` (or `go`, `java`,
`python`, `ruby`, `typescript`). The checks read responses holding unknown
values without calling the Trinsic API, and each API build workflow runs them.
Only enums declared as their own schema are covered, which is every enum in the
API today. The C#, Python, and Ruby checks fail if an enum is ever declared
inside a model property, because the code generated for those has no fallback.

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/overview)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
