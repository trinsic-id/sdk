# Trinsic API TypeScript Library

[![Version](https://img.shields.io/npm/v/@trinsic/api.svg)](https://www.npmjs.org/package/@trinsic/api)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/api-typescript-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic API TypeScript library provides convenient access to the Trinsic API from
applications written in server-side JavaScript/TypeScript.

## Documentation

See the [Trinsic docs](https://connect.docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

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
import { AttachmentsApi, Configuration, NetworkApi, SessionsApi } from "@trinsic/api";

const config = new Configuration({ accessToken: "your-access-token" });

const attachments = new AttachmentsApi(config);
const network = new NetworkApi(config);
const sessions = new SessionsApi(config);

const session = await sessionsApi.createSession();
```

You can find a full TS server example in the [samples](https://github.com/trinsic-id/sdk/tree/main/api-typescript/samples) folder.

## SDK Versioning

Trinsic follows a Semantic Versioning (SemVer) process where all releases will have a version X.Y.Z (like 1.0.0) pattern wherein Z would be a bug fix (e.g., 1.0.1), Y would be a minor release (1.1.0) and X would be a major release (2.0.0). We permit any breaking changes to only be released in major versions and strongly recommend reading changelogs before making any major version upgrades.

## Support

New features and bug fixes are released on the latest major version of the `@trinsic/api` package. If you are on an older major version, we recommend that you upgrade to the latest in order to use the new features and bug fixes including those for security vulnerabilities. Older major versions of the package will continue to be available for use, but will not be receiving any updates.

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://connect.docs.trinsic.id/reference)
- [Developer Guide](https://github.com/stripe/stripe-node/wiki/Passing-Options)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
