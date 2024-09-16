# Trinsic Expo UI Library

[![Version](https://img.shields.io/npm/v/@trinsic/expo-ui.svg)](https://www.npmjs.org/package/@trinsic/expo-ui)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-expo-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic Expo UI Library provides ways to launch verification sessions directly from your Expo application.

This library must be paired with an [api library](https://github.com/trinsic-id/sdk#api-libraries) as part of a full integration.

Currently, only iOS and Android are supported.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
npm install @trinsic/expo-ui
```

## Usage

### 1. Configure your application

Inside your `app.json` configuration file, configure the [`scheme`](https://docs.expo.dev/versions/latest/config/app/#scheme) property, as well as the [`ios.bundleIdentifier`](https://docs.expo.dev/versions/latest/config/app/#bundleidentifier) and [`android.package`](https://docs.expo.dev/versions/latest/config/app/#package) properties.

### 2. Launch the session and receive the results.

Import the Trinsic `launchSession` method:

```tsx
import { launchSession, LaunchSessionResult } from '@trinsic/expo-ui
```

Call this method with the launch url you've retrieved from a trusted backend that can securely reach out to Trinsic's servers. [See our API libraries.](https://github.com/trinsic-id/sdk#api-libraries).

```tsx
const result: LaunchSessionResult = await launchSession(launchUrl, {
  callbackPath: "/",
});
console.log(result);
```

## SDK Versioning

Trinsic follows a Semantic Versioning (SemVer) process where all releases will have a version X.Y.Z (like 1.0.0) pattern wherein Z would be a bug fix (e.g., 1.0.1), Y would be a minor release (1.1.0) and X would be a major release (2.0.0). We permit any breaking changes to only be released in major versions and strongly recommend reading changelogs before making any major version upgrades.

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
