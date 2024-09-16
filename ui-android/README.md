# Trinsic Android UI Library

The Trinsic Android UI Library provides ways to launch verification sessions directly from your Android application.

This library must be paired with an [api library](https://github.com/trinsic-id/sdk#api-libraries) as part of a full integration.

## Installation (Gradle)

This library is delivered via Jitpack.

### 1. Add Jitpack to Gradle Repositories

Add jitpack to the `repositories` block in your Gradle build file:

```
repositories {
    google()
    mavenCentral()
    // Add jitpack below
    maven {
        url = URI("https://jitpack.io")
    }
}
```

### 2. Add library as dependency

Add the library as a Gradle dependency:

```
dependencies {
    ...
    implementation("com.github.trinsic-id:sdk-android-ui")
}
```

## Installation (others)

See the [library's page on Jitpack](https://jitpack.io/#trinsic-id/sdk-android-ui) for installation instructions for Maven and others.

## Setup

### 1. Choose a Custom Scheme

First, choose a custom scheme to register against your app. This is necessary for the library to hook into the final session redirect and pass the results back to your application.

The custom scheme can be any valid URL scheme, but it **must be globally unique**. No other app -- including any of your own -- should register against the same scheme.

An example of a good scheme is `acme-corp-shopping-app-trinsic-redirect`.

### 2. Register the `CallbackActivity` in your app's `AndroidManifest.xml`

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

### 3. (Optional) Setup Task Affinity

If your app's manifest specifies the `android:taskAffinity` property on any activity which calls this library, you must make some adjustments.

#### Custom Task Affinity

If your activity specifies a custom task affinity (which is _not_ an empty string), simply make the following changes:

**1. Change the `CallbackActivity` entry**

Modify the snippet above (which you pasted into your `AndroidManifest.xml`) to specify the _same_ `android:taskAffinity` property as you specify on your own app's activity.

**2. Add an entry for `InvokeActivity`**

Normally, your app does not need to add a manifest entry for `InvokeActivity` (which is provided by this library); however, to align task affinities, you will need to do so.

Simply paste the following snippet next to where you pasted the above snippet, replacing `[your.custom.affinity]` with the custom affinity you specified on your own app's activity.

```xml
<activity
    android:name="id.trinsic.android.ui.InvokeActivity"
    android:taskAffinity="whatever.custom" />
```

#### Empty Task Affinity

> [!WARNING]  
> A [security vulnerability](https://developer.android.com/privacy-and-security/risks/strandhogg) -- affecting all versions of Android below Android 9.0 / API 28 -- is partially mitigated by explicitly specifying an empty `taskAffinity`.
> Although the official recommendation is to change your app's minimum SDK version to `28` or higher, setting an empty `taskAffinity` offers some mitigation for older devices.
> However, since an empty `taskAffinity` breaks this library, think carefully about how you proceed.
>
> Note that this vulnerability is **not related to this library**: if your app's minimum SDK version is less than 28 then it is inherently vulnerable, as the issue exists within Android itself. This library has no effect on your app's security.
>
> Your options are:
> 1. (**Recommended**) Increase your app's minimum SDK version to `28` or higher
>       1. Unless your app requires it (which is uncommon), you can safely remove the `android:taskAffinity=""` property after this change
>       2. This will prevent your app from running on [roughly 9%](https://gs.statcounter.com/os-version-market-share/android) of Android devices
>       3. This is the only way to fully mitigate the aforementioned security issue.
> 2. Remove the `android:taskAffinity=""` field without changing your app's minimum SDK version
>       1. Your app may be vulnerable to activity hijacking on older Android devices

If you specify a custom task affinity of `""` (an empty string), this library cannot function.

This is because cross-task activity communication is not possible in the way this library requires, and an empty task affinity will cause one or more of the library's vital activities to launch in a separate task from your original activity.
