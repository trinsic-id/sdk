# Trinsic Web UI Library

[![Version](https://img.shields.io/npm/v/@trinsic/web-ui.svg)](https://www.npmjs.org/package/@trinsic/web-ui)

`@trinsic/web-ui` launches Trinsic verification sessions from a browser and provides helpers for credential exchanges. Pair it with a Trinsic API SDK to create sessions and retrieve their results.

## Installation

```sh
npm install @trinsic/web-ui@4.1.0-alpha1
```

With a bundler:

```js
import { launchRedirect } from "@trinsic/web-ui";
```

Or, from the global exposed by the IIFE build:

```html
<script src="https://unpkg.com/@trinsic/web-ui@4.1.0-alpha1/dist/index.iife.js"></script>
<script>TrinsicUI.launchRedirect(launchUrl);</script>
```

## Redirect flow

Create the session on your server, including a `redirectUrl` controlled by your application. Save the session's results access key on the server and correlate it to the signed-in user. Then navigate the browser with the returned launch URL.

```js
const session = await fetch("/create-session", { method: "POST" }).then((response) => response.json());
await launchRedirect(session.launchUrl);
```

`launchRedirect` preserves the launch URL's host and query parameters, including EU regional URLs, while authoritatively setting `launchMode=redirect`. It rejects invalid URLs and calls made from inside an iframe; launch this flow only from the top-level browsing context.

When Trinsic sends the browser back to `redirectUrl`, match the `sessionId` query parameter to the session your backend created for the user. Include the stored results access key and any returned `redirectToken` in the backend’s first `GetSessionResult` call, including when polling after redirect. Subsequent calls only need the results access key. Use the API response to determine the verification outcome.

## Migrating from v3

Version 4 removes the secondary-window APIs: `createPopup`, `createPopupAndWaitForResults`, `TrinsicPopup`, and `signalRedirectFromPopup`. There are no compatibility shims.

Move session creation before browser navigation, call `launchRedirect(session.launchUrl)`, and handle the completed session at its `redirectUrl`. Any result polling or post-redirect processing should run in that top-level page or on your backend.

## Credential exchanges

`performCredentialExchange` accepts a base64url challenge containing a complete `v1` request of type `credentialRequest` for the `DigitalCredentialsApi` exchange mechanism.

For a Direct Provider Session with a `PerformNativeChallenge` next step, pass the challenge through unchanged. Send the `exchangeId` and `token` from the returned `CredentialExchangeResult` to your backend.

```js
import { performCredentialExchange } from "@trinsic/web-ui";

const { exchangeId, token } = await performCredentialExchange(session.nextStep.content);
```

Use `isUserOnEligibleAppleWalletBrowser` and `isUserOnEligibleGoogleWalletBrowser` to decide which wallet options to display.

## Support

See the [Trinsic documentation](https://docs.trinsic.id/docs/) or contact [support@trinsic.id](mailto:support@trinsic.id).
