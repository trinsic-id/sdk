# Trinsic API Python Library

![Version](https://img.shields.io/pypi/v/trinsic-api)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/api-python-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic API Python library provides convenient access to the Trinsic API from applications written in Python

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
pip install trinsic-api
```

## Usage

The package needs to be configured with your app's access token, which is
available in the [Trinsic Dashboard](https://dashboard.trinsic.id).

```py
from trinsic_api.api_client import ApiClient
from trinsic_api.api.attachments_api import AttachmentsApi
from trinsic_api.api.network_api import NetworkApi
from trinsic_api.api.sessions_api import SessionsApi

auth_token = "Bearer " + "your-access-token"
configuration = Configuration.get_default()
# Set to true if you want debug request logging
configuration.debug = False
configuration.access_token = token

api_client = ApiClient(configuration=configuration)

attachments_api = AttachmentsApi(api_client)
network_api = NetworkApi(api_client)
sessions_api = SessionsApi(api_client)
```

You can find a full Python server example in the [samples](https://github.com/trinsic-id/sdk/tree/main/api-python/samples) folder.

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
