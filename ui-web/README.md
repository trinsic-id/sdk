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

### Setup

The library exports two methods: `launchPopup(launchUrl)` and `launchRedirect(launchUrl, redirectUrl)`.

#### Bundler

When using a module bundler import the functions as follows:

```js
import { launchRedirect, launchPopup } from "@trinsic/web-ui";
```

#### Script Tag

When using a direct script tag, you can access the methods via the global `TrinsicUI` variable:

```js
await TrinsicUI.launchPopup(async () => CREATE_LAUNCH_URL);
```

### Launch a Session

First, retrieve a launch URL from a trusted backend that can reach out to the Trinsic servers and create sessions. [See our API libraries.](https://github.com/trinsic-id/sdk#api-libraries).

Then, launch the session using one of the three methods exposed by this library:

#### `launchPopup`

Call `await launchPopup(() => create_session_on_your_backend)` to launch the Session as a popup.

This call will return a promise which will resolve when the Session is finished.

#### `launchRedirect`

Call `launchRedirect(launchUrl, redirectUrl)` to launch the session by redirecting the user's browser window. This is similar to an OAuth flow.

This method has no return value, and cannot be awaited in the same way that `launchPopup` can.

When the user completes or aborts the Session, they will be redirected back to your application at `redirectUrl`, with the following query parameters appended:

- `success`
  - Can be `true` or `false`
  - Whether the Session completed successfully
- `resultsAccessKey`
  - May not be present (e.g. if the Session was aborted)
  - Must be processed by your backend to fetch the final identity results for the Session
- `sessionId`
  - The ID of the session that the user is redirecting back from

For example, calling `launchRedirect(launchUrl, "https://example.com/trinsic-redirect")` will cause the user to be redirected to `https://example.com/trinsic-redirect?success=true&sessionId=...&resultsAccessKey=...` upon completion of the Session.

**\*Note:** These parameters can be set to arbitrary values by curious or malicious users simply by editing their browser URL bar. Don't implicitly trust the `success` parameter -- always fetch the Session results from your backend to confirm. Similarly, keep a record of the session ID you sent the user to, and correlate it against the `sessionId` query parameter.\*

You can find a full example of an app using this library in the [samples](https://github.com/trinsic-id/sdk/tree/main/ui-web/samples) folder.

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
