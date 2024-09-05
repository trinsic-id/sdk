# Trinsic API PHP Library

![Version](https://img.shields.io/packagist/v/trinsic/api)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/api-php-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic API PHP library provides convenient access to the Trinsic API from
applications written in PHP.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
composer require trinsic/api
```

## Usage

The package needs to be configured with your app's access token, which is
available in the [Trinsic Dashboard](https://dashboard.trinsic.id).

```php
use Trinsic\Api\Api\AttachmentsApi as AttachmentsApi;
use Trinsic\Api\Api\NetworkApi as NetworkApi;
use Trinsic\Api\Api\SessionsApi as SessionsApi;
use Trinsic\Api\Configuration as Configuration;

$config = new Configuration();
$config->setAccessToken("your-access-token");

$attachments = new AttachmentsApi(null, $config);
$network = new NetworkApi(null, $config);
$sessions = new SessionsApi(null, $config);
```

You can find a full PHP example in the [samples](https://github.com/trinsic-id/sdk/tree/main/api-php/samples) folder.

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
