# C# SDK Sample

This simple application demonstrates how to set up the Trinsic SDK to start verification flows and read their results. It sets 4 server endpoints that an UI application can call
to launch verifications.

## Dependencies

- [Trinsic](https://trinsic.id): Our API library that makes it easy to start accepting digital IDs in your application
- [.NET](https://dotnet.microsoft.com/en-us/): The standard C# web framework for building web applications
- [DotNetEnv](https://github.com/tonerdo/dotnet-env): A minimal dependency to autoload `.env` files into the environment's variables

## Setup

Make sure to use your Trinsic access token to set the `TRINSIC_ACCESS_TOKEN` environment variable. Alternatively you can create a `.env` file and set the environment variable there (see the `example.env` file).

### Running the project

You can run the sample by running the `./start.sh` script. It will check for the presence of the `TRINSIC_ACCESS_TOKEN`, build the UI sample, and then start the .NET application.

Alternatively, you can open the `Sample.sln` file using your IDE of choice. It works best with [JetBrain's Rider](https://www.jetbrains.com/rider/) and [Visual Studio](https://visualstudio.microsoft.com/). Just make sure to build the UI sample in the `ui-web/samples` directory.

## Support

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://docs.trinsic.id/docs/developer-tools)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
