# Web UI SDK Sample

This simple application demonstrates how to set up the Trinsic SDK to start verification flows and read their results. It consumes endpoints from the API samples to launch verification flows through a redirection or a popup. Furthermore, it also demonstrate how to intiate direct flows for a specific digital identity provider.

## Dependencies

- [Trinsic](https://trinsic.id): Our UI SDK library that makes it easy to start accepting digital IDs in your application
- [Vite](https://vitejs.dev/): A build tool and web server that aims to provide a faster and leaner development experience for web projects

## Setup

This project is used by the API samples. You will need to run one of them in order to see it working. To make sure you get them working run `npm ci` in the repository's root, and then `npm run build` in this directory.

### Running the project

You need to run an API sample, so just pick one and follow its intructions. Here we use the `api-typescript` as an example.

In the `api-typescript/samples` folder, run `npm ci` to install the necessary dependencies.

Create a new `.env` file to set your Trinsic Access Token. You can use [`example.env`](./example.env) as a reference. If you need more information where to find this token, visit our [Getting Started](https://docs.trinsic.id/docs/getting-started-with-trinsic-connect) guide.

After you created your `.env` file you are good to run the project.

```sh
npm run dev
```

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
