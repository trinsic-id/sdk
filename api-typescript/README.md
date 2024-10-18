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
import { AttachmentsApi, Configuration, NetworkApi, SessionsApi } from "@trinsic/api";

const config = new Configuration({ accessToken: "your-access-token" });

const attachments = new AttachmentsApi(config);
const network = new NetworkApi(config);
const sessionsApi = new SessionsApi(config);

const session = await sessionsApi.createSession();
```

You can find a full TypeScript server example in the [samples](https://github.com/trinsic-id/sdk/tree/main/api-typescript/samples) folder.

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
