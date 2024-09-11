# trinsic_flutter_ui

Enables invocation of the Trinsic identity verification flow in a Flutter app.

This library must be paired with a [backend library](https://github.com/trinsic-id/sdk#api-libraries) as part of a full integration.

Currently, only iOS and Android are supported.

# Installation

Simply add this library to your Flutter project:

```shell
flutter pub add trinsic_flutter_ui
```

Then import it in your code:

```dart
import 'package:trinsic_flutter_ui/trinsic_flutter_ui.dart';
```

# Setup

## Choose a Custom Scheme

This library makes use of `Android Custom Tabs` on Android and `ASWebAuthenticationSession` on iOS.

Therefore, you must register a custom scheme against your app on both Android and iOS in order for the library to be able to capture the results of a session.

This custom scheme can be the same between iOS and Android, but **should be globally unique to your organization and application**.

An example of a good custom scheme might be `acme-corp-shopping-app-trinsic`.

## Android

### 1. Minimum SDK Version & Default `taskAffinity`
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

### 2. Register Library in `AndroidManifest.xml`
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

## iOS

iOS instructions coming soon

# Usage

Once your backend has created a Session and passed the `launchUrl` to your app, simply invoke the plugin, passing a redirect URL containing the custom scheme you registered above.

The redirect URL can have any path, as long as its scheme is correct. EG, both `acme-corp-shopping-app-trinsic:///callback` and `acme-corp-shopping-app-trinsic:///callback-2` are valid redirect URLs.