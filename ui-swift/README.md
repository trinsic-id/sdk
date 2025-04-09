# Trinsic Swift UI Library

[![Swift UI Version](https://img.shields.io/cocoapods/v/TrinsicUI.svg)](<[https://cocoapods.org/pods/TrinsicUI](https://cocoapods.org/pods/TrinsicUI)>) [![Swift Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-swift-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic Swift UI Library provides ways to launch verification sessions directly in your Swift and Objective-C projects.

This library must be paired with an [api library](https://github.com/trinsic-id/sdk#api-libraries) as part of a full integration.

You can find a full example using this library in the [samples](https://github.com/trinsic-id/sdk/tree/main/ui-swift/samples) folder.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Installation

### Swift package manager

Add the Trinsic repository `https://github.com/trinsic-id/sdk-swift-ui` as a dependency.

### CocoaPods

Add a reference to the `TrinsicUI` pod to your `Podfile` with the latest version (see the shield at the top of the readme) and run `pod install`

```
pod 'TrinsicUI', '~> [latest version]'
```

## Setup

### Choose a Custom Scheme

This library makes use of `ASWebAuthenticationSession` on iOS and macOS.

Therefore, you must register a custom scheme against your app on both iOS and macOS in order for the library to be able to capture the results of a session.

This custom scheme **should be globally unique to your organization and application**.

An example of a good custom scheme might be `acme-corp-shopping-app-trinsic`.

#### Add the scheme to your app's URLs

Select your app's target and on the info tab in XCode add the scheme you selected.

## Usage

Import TrinsicUI into your view:

```swift
import TrinsicUI
```

Create an instance of TrinsicUI and launch a session.
You can retrieve the launch url from a trusted backend that can reach out to the Trinsic servers. [See our API libraries.](https://github.com/trinsic-id/sdk#api-libraries)

```swift
let trinsicUI = TrinsicUI()
let result = try await trinsicUI.launchSession(launchUrl: "[REPLACE_ME]", callbackURL: "[REPLACE_ME]")
```

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
