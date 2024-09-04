# Trinsic SDK's

This repository contains the scripts used to generate SDKs libraries from our OpenAPI spec in every major language. It also contains our UI SDKs to launch verification flows using the Trinsic widget.

## API Libraries

These are our server-side libraries used to communicate with Trinsic's API directly.

[![Go Reference](https://pkg.go.dev/badge/github.com/trinsic-id/sdk-go-api)](https://pkg.go.dev/github.com/trinsic-id/sdk-go-api)
[![C# Version](https://img.shields.io/nuget/v/Trinsic.Api)](https://www.nuget.org/packages/WorkOS.net)
[![Java Version](https://img.shields.io/jitpack/version/com.github.trinsic-id/sdk-java-api)](https://jitpack.io/#trinsic-id/sdk-java-api)
[![PHP Version](https://img.shields.io/packagist/v/trinsic/api)](https://packagist.org/packages/trinsic/api)
[![Python Version](https://img.shields.io/pypi/v/trinsic-api)](https://pypi.org/project/Trinsic-Api/)
[![Ruby Version](https://img.shields.io/gem/v/trinsic_api)](https://rubygems.org/gems/trinsic_api)
[![TypeScript Version](https://img.shields.io/npm/v/@trinsic/api.svg)](https://www.npmjs.org/package/@trinsic/api)

[![Go Status](https://github.com/trinsic-id/sdk/actions/workflows/api-go-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)
[![C# Status](https://github.com/trinsic-id/sdk/actions/workflows/api-csharp-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)
[![Java Status](https://github.com/trinsic-id/sdk/actions/workflows/api-java-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)
[![PHP Status](https://github.com/trinsic-id/sdk/actions/workflows/api-php-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)
[![Python Status](https://github.com/trinsic-id/sdk/actions/workflows/api-python-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)
[![Ruby Status](https://github.com/trinsic-id/sdk/actions/workflows/api-ruby-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)
[![TypeScript Status](https://github.com/trinsic-id/sdk/actions/workflows/api-typescript-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

- [`api-csharp`](./api-csharp/)
- [`api-go`](./api-go/)
- [`api-java`](./api-java/)
- [`api-php`](./api-php/)
- [`api-python`](./api-python/)
- [`api-ruby`](./api-ruby/)
- [`api-typescript`](./api-typescript/)

## UI Libraries

These are our server-side libraries used to communicate with Trinsic's API directly.

[![Version](https://img.shields.io/npm/v/@trinsic/web-ui.svg)](https://www.npmjs.org/package/@trinsic/web-ui)

[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-web-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

- [`ui-android`](./ui-android/)
- [`ui-flutter`](./ui-flutter/)
- [`ui-react-native`](./ui-react-native/)
- [`ui-swift`](./ui-swift/)
- [`ui-web`](./ui-web/)

## SDK Versioning

Trinsic follows a Semantic Versioning (SemVer) process where all releases will have a version X.Y.Z (like 1.0.0) pattern wherein Z would be a bug fix (e.g., 1.0.1), Y would be a minor release (1.1.0) and X would be a major release (2.0.0). We permit any breaking changes to only be released in major versions and strongly recommend reading changelogs before making any major version upgrades.

## Support

New features and bug fixes are released on the latest major version of our packages. If you are on an older major version, we recommend that you upgrade to the latest in order to use the new features and bug fixes including those for security vulnerabilities. Older major versions of the package will continue to be available for use, but will not be receiving any updates.

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://connect.docs.trinsic.id/reference)
- [Developer Guide](https://github.com/stripe/stripe-node/wiki/Passing-Options)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
