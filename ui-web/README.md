# Trinsic Web UI Library

[![Version](https://img.shields.io/npm/v/@trinsic/web-ui.svg)](https://www.npmjs.org/package/@trinsic/web-ui)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-web-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic React Native UI Library provides ways to launch verification sessions directly from your web frontend in the browser.

This library must be paired with a [api library](https://github.com/trinsic-id/sdk#api-libraries) as part of a full integration.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
npm install @trinsic/web-ui
```

## Usage

The library exports three methods: `launchIframe(launchUrl)`, `launchPopup(launchUrl)` and `launchRedirect(launchUrl, redirectUrl)`.

Depending on how you would like your user interaction to be, an embedded iFrame, a popup or a redirect flow, choose your start point.

You can retrieve the launch url from a trusted backend that can reach out to the Trinsic servers. [See our API libraries.](https://github.com/trinsic-id/sdk#api-libraries)

You can find a full example using this library in the [samples](https://github.com/trinsic-id/sdk/tree/main/ui-web/samples) folder.

## SDK Versioning

var configuration = new Configuration { AccessToken = "your-access-token" };

var attachments = new AttachmentsApi(configuration);
var network = new NetworkApi(configuration);
var sessions = new SessionsApi(configuration);

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
