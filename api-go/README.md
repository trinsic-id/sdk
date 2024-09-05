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
