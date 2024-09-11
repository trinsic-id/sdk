# Trinsic Expo UI Library

[![Version](https://img.shields.io/npm/v/@trinsic/expo-ui.svg)](https://www.npmjs.org/package/@trinsic/expo-ui)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-expo-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic Expo UI Library provides ways to launch verification sessions directly from your Expo application requiring very little code.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
npm install @trinsic/expo-ui
```

## Usage

The library exports one method: `launchSession`.

You can retrieve the launch url from a trusted backend that can reach out to the Trinsic servers. [See our backend language examples](https://github.com/trinsic-id/sdk/tree/main/api-typescript/samples).

You can find a full example using this library in the [samples](https://github.com/trinsic-id/sdk/tree/main/ui-expo/samples) folder.

## SDK Versioning

Trinsic follows a Semantic Versioning (SemVer) process where all releases will have a version X.Y.Z (like 1.0.0) pattern wherein Z would be a bug fix (e.g., 1.0.1), Y would be a minor release (1.1.0) and X would be a major release (2.0.0). We permit any breaking changes to only be released in major versions and strongly recommend reading changelogs before making any major version upgrades.

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
