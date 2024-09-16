# Trinsic React Native UI Library

[![Version](https://img.shields.io/npm/v/@trinsic/react-native-ui.svg)](https://www.npmjs.org/package/@trinsic/react-native-ui)
[![Build Status](https://github.com/trinsic-id/sdk/actions/workflows/ui-react-native-release.yml/badge.svg)](https://github.com/trinsic-id/sdk/actions?query=branch%main)

The Trinsic React Native UI Library provides ways to launch verification sessions directly from your React Native application. If you're using Expo we recommend you use [our Expo library](https://github.com/trinsic-id/sdk/ui-expo).

This library must be paired with an [api library](https://github.com/trinsic-id/sdk#api-libraries) as part of a full integration.

Currently, only iOS and Android are supported.

## Installation

```sh
npm install @trinsic/react-native-ui
```

## Setup

### Choose a Custom Scheme

This library makes use of `Android Custom Tabs` on Android and `ASWebAuthenticationSession` on iOS.

Therefore, you must register a custom scheme against your app on both Android and iOS in order for the library to be able to capture the results of a session.

This custom scheme can be the same between iOS and Android, but **should be globally unique to your organization and application**.

An example of a good custom scheme might be `acme-corp-shopping-app-trinsic`.

### iOS

#### Configure your iOS Podfile to use static libraries

If you're not already using static libraries, add the following line to your podfile to be able to use our Swift module:

```
use_frameworks! :linkage => :static
```

#### Add the scheme to your app's URLs

Select your app's target and on the info tab in XCode add the scheme you selected.

### Android

#### Adjust manifest

> [!IMPORTANT]  
> If your app's `AndroidManifest.xml` specifies a custom `android:taskAffinity` property for its main activity (which is uncommon), you will need to [perform some additional setup](https://github.com/trinsic-id/sdk-android-ui#3-optional-setup-task-affinity).

Place the following snippet in your app's `AndroidManifest.xml`, replacing `[YOURCUSTOMSCHEME]` with the scheme you chose above

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

#### Set SDK minVersion

We require the minimum SDK version of 26. Adjust in your build.grade file the minSDK property to 26 if not already 26 or higher.

## Usage

```js
import { launchSession } from '@trinsic/react-native-ui';

// ...

const launchUrl = ''; //get this from your backend creating a session using the createSession API
const result = await launchSession(
  launchUrl,
  'yourAppsScheme://your-callback-url'
);
```

## License

MIT
