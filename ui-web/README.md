# Trinsic Web UI Library

[![Version](https://img.shields.io/npm/v/@trinsic/web-ui.svg)](https://www.npmjs.org/package/@trinsic/web-ui)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-web-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic Web UI Library provides ways to launch verification sessions directly from your web frontend in the browser.

This library must be paired with an [api library](https://github.com/trinsic-id/sdk#api-libraries) as part of a full integration.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
npm install @trinsic/web-ui
```

If you're using a CDN, for example unpkg, you can use the below source.

```html
<script src="http://unpkg.com/@trinsic/web-ui"><script>
```

## Usage

The library exports three methods: `launchIframe(launchUrl)`, `launchPopup(launchUrl)` and `launchRedirect(launchUrl, redirectUrl)`.

When using a module bundler import the functions as follows:

```js
import { launchIframe, launchRedirect, launchPopup } from "@trinsic/web-ui";
```

When using a direct script tag, you can access the methods via the global `TrinsicUI` variable:

```js
launchIframe(LAUNCH_URL);
```

You can retrieve the launch URL from a trusted backend that can reach out to the Trinsic servers and create sessions. [See our API libraries.](https://github.com/trinsic-id/sdk#api-libraries).

if you want to do it in a sense like OAUTH flow, you can use secure redirect way. After receiving launch URL from backend just:

```js
launchRedirect(LAUNCH_URL, REDIRECT_URL);
```
Then the page will browse to Trinsic launch session UI and user does the identification and upon success or error the callback URL will be called back on redirect URL.
The format of callback redirect call (you need to handle it in your web application to be ready for these redirected callbacks):

```
[YOUR_CALLBACK_URL]?success=true&resultsAccessKey=[RESULTS_ACCESS_KEY]&sessionId=[SESSION_UUID]
```


You can find a full example using this library in the [samples](https://github.com/trinsic-id/sdk/tree/main/ui-web/samples) folder.

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
