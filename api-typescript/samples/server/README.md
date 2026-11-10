# TypeScript SDK Sample

This simple application demonstrates how to set up the Trinsic SDK to start verification flows and read their results. It sets 4 server endpoints that an UI application can call
to launch verifications.

## Dependencies

- [Trinsic](https://trinsic.id): Our API library that makes it easy to start accepting digital IDs in your application
- [Express.js](https://expressjs.com/): An unopinionated, minimalist web framework for Node.js

## Setup

Make sure to create a new `.env` file to set your Trinsic Access Token. You can use [`example.env`](./example.env) as a reference. If you need more information where to find this token, visit our [documentation](https://docs.trinsic.id).

The sample uses the generated SDK in `api-typescript/sdk` through a local package
dependency. Build it first so the sample uses the same named request arguments
as the SDK in this checkout. After creating your `.env`, run the following from
this directory. `start.sh` checks for `TRINSIC_ACCESS_TOKEN`, builds the UI sample,
and starts the TypeScript application.

```sh
../../build-sdk.sh
./start.sh
```

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
