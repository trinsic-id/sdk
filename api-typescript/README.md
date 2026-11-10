# Trinsic API TypeScript Library

[![Version](https://img.shields.io/npm/v/@trinsic/api.svg)](https://www.npmjs.org/package/@trinsic/api)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/api-typescript-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic API TypeScript library provides convenient access to the Trinsic API from applications written in server-side JavaScript/TypeScript.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
npm install @trinsic/api
```

## Usage

The package needs to be configured with your app's access token, which is
available in the [Trinsic Dashboard](https://dashboard.trinsic.id).

<!-- prettier-ignore -->
```ts
import { Configuration, ProvidersApi, SessionsApi } from "@trinsic/api";

const config = new Configuration({ accessToken: "your-access-token" });

const providers = new ProvidersApi(config);
const sessions = new SessionsApi(config);

const result = await sessions.getSessionResult({
  sessionId,
  getSessionResultRequest: { resultsAccessKey },
});
```

You can find a full TypeScript server example in the [samples](https://github.com/trinsic-id/sdk/tree/main/api-typescript/samples) folder.

Endpoint parameters are supplied by name in one request object. For example,
replace `sessions.getSession(sessionId)` with `sessions.getSession({ sessionId })`.
Body parameters are nested under their generated request name, as shown above.
Optional fetch overrides remain a separate final argument. Model fields are
still ordinary named object properties.

This is a breaking change intended for the next major SDK release. The sample
uses the locally generated SDK so its calls are checked against this API.

### Data residency

By default, the SDK communicates with `https://api.trinsic.id`. If you have a Verification Profile configured for EU data residency, set the SDK `basePath` to `https://api.eu.trinsic.id`.

```ts
import { Configuration, SessionsApi } from "@trinsic/api";

const config = new Configuration({
  basePath: "https://api.eu.trinsic.id", // omit to use the default endpoint
  accessToken: "your-access-token",
});

const sessions = new SessionsApi(config);
```

### Unknown enum values

The API can add enum values after this SDK version was released. A value this
version does not know is returned as the original string, even though the enum
type lists only the values known when the SDK was generated. Keep a default
branch when handling enum values:

```ts
switch (session.errorCode) {
  case SessionErrorCode.Expired:
    break;
  default:
    // Also reached for an error code newer than this SDK version.
    break;
}
```

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
