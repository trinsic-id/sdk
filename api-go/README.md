# Trinsic API Go Library

[![Go Reference](https://pkg.go.dev/badge/github.com/trinsic-id/sdk-go-api)](https://pkg.go.dev/github.com/trinsic-id/sdk-go-api)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/api-go-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic API Go library provides convenient access to the Trinsic API from
applications written in Go.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

Install the package with:

```sh
go get github.com/trinsic-id/sdk-go-api
```

## Usage

The package needs to be configured with your app's access token, which is
available in the [Trinsic Dashboard](https://dashboard.trinsic.id).

```go
import "github.com/trinsic-id/sdk-go-api"

func main() {
	config := trinsic_api.NewConfiguration()
	config.AddDefaultHeader("Authorization", "Bearer "+"your-access-token")

	api := trinsic_api.NewAPIClient(config)

    attachments := api.AttachmentsAPI;
    network := api.NetworkAPI;
    sessions := api.SessionsAPI;
}
```

You can find a full Go example in the [samples](https://github.com/trinsic-id/sdk/tree/main/api-go/samples) folder.

## SDK Versioning

Trinsic follows a Semantic Versioning (SemVer) process where all releases will have a version X.Y.Z (like 1.0.0) pattern wherein Z would be a bug fix (e.g., 1.0.1), Y would be a minor release (1.1.0) and X would be a major release (2.0.0). We permit any breaking changes to only be released in major versions and strongly recommend reading changelogs before making any major version upgrades.

## Support

New features and bug fixes are released on the latest major version of the `sdk-go-api` package. If you are on an older major version, we recommend that you upgrade to the latest in order to use the new features and bug fixes including those for security vulnerabilities. Older major versions of the package will continue to be available for use, but will not be receiving any updates.

Any issues, inquiries, and feature requests can be sent to [support@trinsic.id](mailto:support@trinsic.id), or feel free to open a GitHub issue [here](https://github.com/trinsic-id/sdk/issues).

## More Information

- [API Reference](https://docs.trinsic.id/reference)
- [Developer Guide](https://github.com/stripe/stripe-node/wiki/Passing-Options)
- [Our Blog](https://trinsic.id/blog/)
- [Schedule a demo](https://trinsic.id/contact/)
