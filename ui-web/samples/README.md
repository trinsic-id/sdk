# Web UI SDK Sample

This simple application demonstrates how to set up the Trinsic SDK to start verification flows and read their results. It consumes endpoints from the API samples to launch verification flows through top-level redirects. It also demonstrates direct flows for a specific digital identity provider.

## Dependencies

- [Trinsic](https://trinsic.id): Our UI SDK library that makes it easy to start accepting digital IDs in your application
- [Vite](https://vitejs.dev/): A build tool and web server that aims to provide a faster and leaner development experience for web projects

## Setup

Run `npm ci` and `npm run build` in this directory to build the sample against the Web UI SDK in this checkout.

To launch a verification, run one of the API sample servers. The server serves these pages and handles session creation and result collection. Follow the [TypeScript sample setup](../../api-typescript/samples/server/README.md) to configure credentials and start that server.

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
