# Trinsic Web UI Library

[![Version](https://img.shields.io/npm/v/@trinsic/web-ui.svg)](https://www.npmjs.org/package/@trinsic/web-ui)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-web-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic Web UI Library provides ways to launch verification sessions directly in the browser requiring very little code.

## Documentation

See the [Trinsic docs](https://connect.docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
npm install @trinsic/web-ui
```

## Usage

The library exports three methods: `launchIframe(launchUrl)`, `launchPopup(launchUrl)` and `launchRedirect(launchUrl, redirectUrl)`.

Depending on how you would like your user interaction to be, an embedded iFrame, a popup or a redirect flow, choose your start point.

You can retrieve the launch url from a trusted backend that can reach out to the Trinsic servers. [See our backend language examples](https://github.com/trinsic-id/sdk/tree/main/api-typescript/samples).

You can find a full example using this library in the [samples](https://github.com/trinsic-id/sdk/tree/main/ui-web/samples) folder.

## SDK Versioning

Trinsic follows a Semantic Versioning (SemVer) process where all releases will have a version X.Y.Z (like 1.0.0) pattern wherein Z would be a bug fix (e.g., 1.0.1), Y would be a minor release (1.1.0) and X would be a major release (2.0.0). We permit any breaking changes to only be released in major versions and strongly recommend reading changelogs before making any major version upgrades.

## Support

New features and bug fixes are released on the latest major version of the `@trinsic/web-ui` package. If you are on an older major version, we recommend that you upgrade to the latest in order to use the new features and bug fixes including those for security vulnerabilities. Older major versions of the package will continue to be available for use, but will not be receiving any updates.

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://connect.docs.trinsic.id/reference)
- [Developer Guide](https://github.com/stripe/stripe-node/wiki/Passing-Options)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
