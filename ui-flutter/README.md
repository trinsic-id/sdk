# Trinsic Flutter UI Library

[![Flutter Version](https://img.shields.io/pub/v/trinsic_flutter_ui.svg)](https://pub.dev/packages/trinsic_flutter_ui) [![Flutter Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-flutter-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic Flutter UI Library provides ways to launch verification sessions directly from your Flutter application requiring very little code.

This library must be paired with an [api library](https://github.com/trinsic-id/sdk#api-libraries) as part of a full integration.

Currently, only iOS and Android are supported.

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## Supported Use Cases

### Widget and Hosted Provider Sessions

This library supports launching both [Widget](https://docs.trinsic.id/docs/widget-session) and [Hosted Provider](https://docs.trinsic.id/docs/hosted-provider-session) Sessions.

You _must_ specify a `redirectUrl` when creating either kind of Session, and that `redirectUrl` _must_ use a custom scheme which you register against your app (see below).

### Advanced Provider Sessions

This library provides **only minimal** support for [Advanced Provider Sessions](https://docs.trinsic.id/docs/advanced-provider-session). 

Specifically, it can be used only to execute Sessions which return a `launchMethod` of `LaunchBrowser` and a `collectionMethod` of `CaptureRedirect`.

All other interaction methods are not supported by this library and will require additional effort to implement; please contact Trinsic for guidance.


## Installation

Simply add this library to your Flutter project:

```shell
flutter pub add trinsic_flutter_ui
```

Then import it in your code:

```dart
import 'package:trinsic_flutter_ui/trinsic_flutter_ui.dart';
```

## Setup

### Choose a Custom Scheme

This library makes use of `Android Custom Tabs` on Android and `ASWebAuthenticationSession` on iOS.

Therefore, you must register a custom scheme against your app on both Android and iOS in order for the library to be able to capture the results of a session.

This custom scheme can be the same between iOS and Android, but **should be globally unique to your organization and application**.

An example of a good custom scheme might be `acme-corp-shopping-app-trinsic`.

### iOS

#### Minimum version

The iOS SDK supports iOS from version 13.4 for securely launching authentication sessions. Make sure to upgrade your Podfile dependency and XCode minimum target.

#### Configure your iOS Podfile to use static libraries

If you're not already using static libraries, add the following line to your podfile to be able to use our Swift module:

```
use_frameworks! :linkage => :static
```

#### Add the scheme to your app's URLs

Select your app's target and on the info tab in XCode add the scheme you selected.

### Android

#### Minimum SDK Version & Default `taskAffinity`

> [!NOTE]
> Although increasing your app's minimum SDK version to `28` or higher is technically optional, it is the only way to remove the Flutter-generated `android:taskAffinity=""` property
> without reducing your application's resistance to [StrandHogg](https://developer.android.com/privacy-and-security/risks/strandhogg).
>
> It is worth considering that the `taskAffinity` mitigation is _only partial_ -- the only way to fully protect your app from this vulnerability is to set a minimum SDK version of `28` or higher,
> as Google recommends.
>
> Finally, note that this library has no bearing on your application's security -- this vulnerability is present regardless of whether this library is in use or not, as it is inherent to Android.
> It is only relevant to this library because it cannot function if your app specifies an empty `taskAffinity`.

You will need to make two changes to the Android scaffolding which Flutter auto-generated for your app.

1. In your app's `AndroidManifest.xml`, remove the `android:taskAffinity=""` directive on your main activity's declaration
   1. The library _cannot function_ if your main activity has an empty task affinity
   2. If you wish to use a _custom_ (non-empty) task affinity, [refer to our Android SDK documentation](https://github.com/trinsic-id/sdk-android-ui#3-optional-setup-task-affinity) to set this up
2. Modify your app's `build.gradle[.kts]` to increase the `minSdk` directive to at least `28`
   1. This is necessary for the security of your application (explained below)

These changes are necessary to A) ensure library functionality and B) do so in a way that maintains application security.

Flutter automatically adds `taskAffinity=""` to your app's manifest [in order to mitigate a security issue](https://github.com/flutter/flutter/issues/63559); however, this directive breaks libraries
which use Android Custom Tabs in the way we do, as it changes Android's task management logic in an incompatible way.

This security issue is entirely mitigated on Android SDK versions 28 and up. Therefore, both changes (removing the empty task affinity and increasing the minimum android SDK version of your app) are necessary
to ensure functionality without reducing security.

#### Register Library in `AndroidManifest.xml`

Place the following snippet in your app's `AndroidManifest.xml`, replacing `[YOURCUSTOMSCHEME]` with the scheme you chose in step 1

```xml
<activity
    android:name="id.trinsic.android.ui.CallbackActivity"
    android:exported="true">
    <intent-filter android:label="trinsic">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <data android:scheme="[YOURCUSTOMSCHEME]" />
    </intent-filter>
</activity>
```

## Usage

Once your backend has created a Session and passed the `launchUrl` to your app, simply invoke the plugin, passing a redirect URL containing the custom scheme you registered above.

The redirect URL can have any path, as long as its scheme is correct. EG, both `acme-corp-shopping-app-trinsic:///callback` and `acme-corp-shopping-app-trinsic:///callback-2` are valid redirect URLs.

## License

MIT
