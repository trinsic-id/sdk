# Trinsic Web UI Library

[![Version](https://img.shields.io/npm/v/@trinsic/web-ui.svg)](https://www.npmjs.org/package/@trinsic/web-ui)

`@trinsic/web-ui` launches Trinsic verification sessions from a browser and provides helpers for mDL exchanges. Pair it with a Trinsic API SDK to create sessions and retrieve their results.

## Installation

```sh
npm install @trinsic/web-ui
```

With a bundler:

```js
import { launchRedirect } from "@trinsic/web-ui";
```

Or, from the global exposed by the IIFE build:

```html
<script src="https://unpkg.com/@trinsic/web-ui"></script>
<script>TrinsicUI.launchRedirect(launchUrl);</script>
```

## Redirect flow

Create the session on your server, including a `redirectUrl` controlled by your application. Save the session's results access key on the server and correlate it to the signed-in user. Then navigate the browser with the returned launch URL.

```js
const session = await fetch("/create-session", { method: "POST" }).then((response) => response.json());
await launchRedirect(session.launchUrl);
```

`launchRedirect` preserves the launch URL's host and query parameters, including EU regional URLs, while authoritatively setting `launchMode=redirect`. It rejects invalid URLs and calls made from inside an iframe; launch this flow only from the top-level browsing context.

When Trinsic sends the browser back to `redirectUrl`, use the `sessionId` query parameter only to locate the server-side session record, then retrieve and validate the result through Trinsic's API. Do not trust `success` or other redirect query parameters as proof of a completed verification.

## Migrating from v3

Version 4 removes the secondary-window APIs: `createPopup`, `createPopupAndWaitForResults`, `TrinsicPopup`, and `signalRedirectFromPopup`. There are no compatibility shims.

Move session creation before browser navigation, call `launchRedirect(session.launchUrl)`, and handle the completed session at its `redirectUrl`. Any result polling or post-redirect processing should run in that top-level page or on your backend.

## mDL helpers

The mDL APIs remain available: `performMdlExchange`, `isUserOnEligibleAppleWalletBrowser`, `isUserOnEligibleGoogleWalletBrowser`, and the `MdlExchangeResult` type.

## Support

See the [Trinsic documentation](https://docs.trinsic.id/docs/) or contact [support@trinsic.id](mailto:support@trinsic.id).
