# @trinsic/react-native-ui

Helper methods to launch and capture the results of a Trinsic verification

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

### Android

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

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
