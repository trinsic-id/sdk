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

## Setup

#### Bundler

When using a module bundler import the functions as follows:

```js
import { createPopup } from "@trinsic/web-ui";
```

#### Script Tag

When using a direct script tag, you can access the methods via the global `TrinsicUI` variable:

```js
await TrinsicUI.launchPopup(async () => CREATE_LAUNCH_URL);
```

## A Note on iFrames

If you are using this library to launch Trinsic sessions from within an iFrame, there are some additional complexities and requirements to be aware of:

- **1. Popup flow is required**
    - Due to browser security restrictions regarding cookies in iFrames, many Identity Providers' web flows do not support being launched in an iFrame.
    - Therefore, if you are running within an iFrame, you **must** use the popup flow to launch sessions.
- **2. Polling function is required with the popup flow**
    - This library's popup flow primarily works via cross-window messaging between the popup window and the parent window. However, certain Identity Providers may use browser security headers (e.g. `Cross-Origin-Opener-Policy`) which prevent this cross-window messaging from working.
      - Therefore, in certain circumstances, it may be impossible for the popup window to send the finalization signal to the parent window.
    - As a consequence, you **must** provide a value for `pollingFunction` when awaiting a popup's completion.
        - This function should hit your backend and query the status of the session.

## Usage
### Redirect Query Parameters

When using either flow below, the user will be redirected back to a URL controlled by your application when they are finished with a verification.

The following query parameters will be appended to the redirect URL:

| Parameter   | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| `success`   | Can be `true` or `false`. Whether the Session completed successfully. |
| `sessionId` | The ID of the session that the user is redirecting back from.         |

**Note:** These parameters can be set to arbitrary values by curious or malicious users simply by editing their browser URL bar. Don't implicitly trust the `success` parameter -- always fetch the Session results from your backend to confirm. Similarly, keep a record of the session ID you sent the user to, and correlate it against the `sessionId` query parameter.

----

### Top-Level Redirect Flow

Use this flow if you wish to redirect the user's entire browser window to perform a verification.

#### 1. Create Session
Create a Trinsic Session in your backend, then send the `launchUrl` to your frontend.

#### 2. Call `launchRedirect(launchUrl)`

From your frontend, call the `launchRedirect(launchUrl)` method, which will redirect the user's browser.

#### 3. Handle Redirect

When the user is redirected back to your application, hit Trinsic's API to fetch the Session status and results.

----

### Popup Redirect Flow

Use this flow if you wish to launch the verification in a popup window, receiving a callback when the session is completed.

#### 1. Call `createPopup`

Call the `createPopup` method, which will return a `TrinsicPopup` instance.

If the popup fails to open (such as if the browser blocks it), this method will throw.

```js
import { createPopup, TrinsicPopup } from "@trinsic/web-ui";

let popup: TrinsicPopup;
try {
  popup = createPopup({
    initialWindowTitle: "Test",
  });
} catch (e) {
  console.error("Failed to create popup", e);
  return;
}
```

#### 2. Create Trinsic Session
Once the popup has been created, call your backend to create a session via Trinsic's API. Return the `launchUrl` to your frontend.

#### 3. Initialize popup & await results
Once your frontend has a `launchUrl`, call the `initialize` method on the `TrinsicPopup` instance. This will redirect the open popup window to the `launchUrl`.

```js
// Initialize popup with Launch URL for Session
popup.initialize(launchUrl);

// Await results
const popupResult = await popup.waitForCompletion({
  onWindowMaybeClosed: () => {
    // OPTIONAL
    //
    // This function is called when the connection to the popup window is lost.
    // This can occur if the popup is closed, but can also occur if the popup
    // visits a page with a restrictive `Cross-Origin-Opener-Policy` header,
    // thus causing the browser to sever the connection to the popup for security reasons.

    // Because the popup may still be open and may still resolve successfully, you should not
    // take an authoritative action here. Instead, use this callback to prompt your UI
    // to display a prompt to the user, where they are given the opportunity to cancel out or retry.
  },

  pollingFunction: async () => {
    // OPTIONAL unless running in an iFrame
    //
    // A function which will periodically be called to check if the session is complete.
    // If this function returns `true`, the `waitForCompletion()` call will resolve.
    //
    // This MUST be specified if you are launching a popup from within an iFrame.
  }
});

// `code` contains a response code indicating the reason the `waitForCompletion()` call resolved.
const {sessionId, code} = popupResult.code;

// To know if the Session was successful or unsuccessful, call your backend to hit Trinsic's API.
```

----

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
