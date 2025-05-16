# PHP SDK Sample

This simple application demonstrates how to set up the Trinsic SDK to start verification flows and read their results. It sets 4 server endpoints that an UI application can call
to launch verifications.

## Dependencies

- [Trinsic](https://trinsic.id): Our API library that makes it easy to start accepting digital IDs in your application
- [Slim](https://www.slimframework.com/): Slim is a PHP micro framework that helps you quickly write simple web applications and APIs
- [phpdotenv](https://github.com/vlucas/phpdotenv): Loads environment variables from `.env` to `getenv()`, `$_ENV` and `$_SERVER` automatically.

## Setup

Create a new `.env` file to set your Trinsic Access Token. You can use [`example.env`](./example.env) as a reference. If you need more information where to find this token, visit our [Getting Started](https://docs.trinsic.id/docs/getting-started-with-trinsic-connect) guide.

After you created your `.env`, you can run the sample by running the `./start.sh` script. It will check for the presence of the `TRINSIC_ACCESS_TOKEN` in the `.env` file, build the UI sample, and then start the PHP server.

```sh
./start.sh
```

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
