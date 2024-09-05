# Trinsic API Python Library

![Version](https://img.shields.io/pypi/v/trinsic-api)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/api-python-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic API Python library provides convenient access to the Trinsic API from
applications written in Python

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
api_client = ApiClient(configuration=None, header_name="Authorization", header_value=auth_token)

attachments_api = AttachmentsApi(api_client)
network_api = NetworkApi(api_client)
sessions_api = SessionsApi(api_client)
```

You can find a full Python server example in the [samples](https://github.com/trinsic-id/sdk/tree/main/api-python/samples) folder.

## SDK Versioning

Trinsic follows a Semantic Versioning (SemVer) process where all releases will have a version X.Y.Z (like 1.0.0) pattern wherein Z would be a bug fix (e.g., 1.0.1), Y would be a minor release (1.1.0) and X would be a major release (2.0.0). We permit any breaking changes to only be released in major versions and strongly recommend reading changelogs before making any major version upgrades.

## Support

New features and bug fixes are released on the latest major version of the package. If you are on an older major version, we recommend that you upgrade to the latest in order to use the new features and bug fixes including those for security vulnerabilities. Older major versions of the package will continue to be available for use, but will not be receiving any updates.

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://github.com/stripe/stripe-node/wiki/Passing-Options)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
