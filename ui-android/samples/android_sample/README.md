# Trinsic Android UI Library Sample

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## How This Sample Works

> [!IMPORTANT]  
> This sample, by default, *does not hit Trinsic's API* or perform real verifications. Instead, it uses a Trinsic-provided test API which allows for quick and convenient testing of the library's functionality **without** needing a real API key or a backend of your own.
> 
> Once you have implemented your own backend, this sample can easily be configured to perform real verifications simply by changing the `BACKEND_CREATE_SESSION_ENDPOINT` constant in `MainActivity.java` to point to your backend's endpoint.

This sample implements the Trinsic Android UI Library to the extent necessary to demonstrate the basic functionality of the library.
It includes both supported session launch paths:

1. (Recommended) Activity Result API
2. `PendingIntent` API

_See the [SDK Documentation](https://github.com/trinsic-id/sdk/tree/main/ui-android#usage-1) to better understand the differences between these two flows._

The optional native credential sample uses `TrinsicCredentials.performCredentialExchange`.
Set `CREDENTIAL_REQUEST_OBJECT_BASE64URL` in `MainActivity.java` to the unchanged `nextStep.content` from a Direct Provider Session whose `nextStep.method` is `PerformNativeChallenge` to show the **Launch Credential Exchange** button.
The native challenge must use the `credentialRequest` type; the previous `TrinsicMdl` API and `mdlRequest` type are no longer supported.


The relevant files for this sample are:
- [[....]/MainActivity.java](https://github.com/trinsic-id/sdk/blob/main/ui-android/samples/android_sample/app/src/main/java/id/trinsic/android_sample/MainActivity.java)
  - Implements both Trinsic UI launch paths and handles session result callbacks
- [app/src/main/AndroidManifest.xml](https://github.com/trinsic-id/sdk/blob/main/ui-android/samples/android_sample/app/src/main/AndroidManifest.xml)
  - Registers the custom URL scheme used to handle redirect responses and the receiver used by the `PendingIntent` flow
- [settings.gradle.kts](https://github.com/trinsic-id/sdk/blob/main/ui-android/samples/android_sample/settings.gradle.kts)
  - Adds Google and Maven Central repositories and an optional local SDK dependency override
- [app/build.gradle.kts](https://github.com/trinsic-id/sdk/blob/main/ui-android/samples/android_sample/app/build.gradle.kts)
  - Adds Trinsic Android SDK as a dependency

## Build the Sample

The sample depends on `id.trinsic:sdk-android-ui` from Maven Central, using the version declared in [app/build.gradle.kts](app/build.gradle.kts).
To build against the SDK commit pinned in this repository, including before publication, initialize the submodule and run the sample build script from the repository root:

```sh
git submodule update --init ui-android/sdk
./ui-android/build-samples.sh
```

The script uses `-PuseLocalTrinsicSdk=true` to substitute the checked-out SDK library for the Maven dependency.
You can also pass that flag to `./gradlew build` from the sample directory; without it, Gradle uses Maven Central.
Use the local SDK option until the declared version is published to Maven Central.

## Implementation Guide

Below is a step-by-step guide to understanding both A) what this sample does and B) how to implement its functionality into your own app.

### 1. Install and Configure the SDK

Configure the SDK as shown in this sample, including:
- Adding `google()` and `mavenCentral()` to your Gradle repositories
- Including the `id.trinsic:sdk-android-ui` dependency with your chosen release version
- Registering a custom URL scheme to handle redirect responses
- Updating your `AndroidManifest.xml` to include the required activity declaration pointing to your custom scheme

### 2. Prepare the Launch Activity for Activity Result API

**This step does not apply when using the `PendingIntent` API.**
In the Activity class which will initiate a Trinsic Session (e.g., your "verify your identity" Activity), you’ll need to:

#### a. Declare a `TrinsicUI` variable

Add this as a property of the class, typically at the top of the activity file:

```java
private TrinsicUI trinsicUI;
```

#### b. Instantiate `TrinsicUI` inside `onCreate()`

You **must** call the constructor of `TrinsicUI` inside your `onCreate()` method every time it's invoked. This sets up an activity listener that the library uses to receive the Session result. **Do not** put this instantiation inside of an `if` statement.

```java
trinsicUI = new TrinsicUI(this, (result) -> {
    if (result.getCanceled()) {
        // User exited the verification session
    } else {
        // The browser flow completed; verification may have succeeded or failed.
        String sessionId = result.getSessionId();
        String redirectToken = result.getRedirectToken();
        String callbackUrl = result.getCallbackUrl();
        // Send the session ID and redirect token to your backend for processing.
        // The callback URL preserves the full redirect, including its query and fragment.
    }
});
```

This callback will be invoked once the user finishes a Session -- whether it succeeds, fails, or is cancelled.
Use your backend's Trinsic API response for session status and its stored results access key; these are no longer fields on the SDK's session result.
In Java, a `String` reference can hold `null`; all three string getters shown above are explicitly annotated `@Nullable` in the SDK, so callers must handle missing values.
The session ID and redirect token can be `null` when absent or empty, and the callback URL is `null` when the browser is closed without a callback.

### 3. Obtain a Session Launch URL

You’ll need to make a call to your backend to create a new Trinsic Session and retrieve its `launchUrl`.

The sample app demonstrates this using a test-only endpoint (`https://verify.trinsic.id/api/mobiletest/create-session`), but in production you'll want to use the [Trinsic API SDK](https://github.com/trinsic-id/sdk#api-libraries) on your backend to create a real Session and return the resulting `launchUrl` to your app.

Example flow:
1. User taps a “Verify Identity” button.
2. Your frontend makes a request to your backend.
3. Your backend calls Trinsic to create a session, and returns the `launchUrl` to the frontend.

### 4A. Launch the Session with Activity Result API

If using the Activity Result API, invoke the Trinsic SDK:

```java
trinsicUI.LaunchSession(MainActivity.this, launchUrl);
```

This will launch an Android Custom Tab and guide the user through the identity verification flow. When complete, your previously defined callback will be triggered with the results.

### 4B. Launch the Session with PendingIntent

Use the `PendingIntent` API when you cannot instantiate `TrinsicUI` unconditionally during Activity or Fragment initialization.
The sample demonstrates this with the `Launch Trinsic Session (PendingIntent)` button.

Register a receiver in `AndroidManifest.xml`:

```xml
<receiver
    android:name=".MainActivity$AcceptanceSessionResultReceiver"
    android:exported="false" />
```

Create a broadcast `PendingIntent` and launch the session:

```java
Intent callbackIntent = new Intent(MainActivity.this, AcceptanceSessionResultReceiver.class);
PendingIntent resultPendingIntent = PendingIntent.getBroadcast(
        MainActivity.this,
        0,
        callbackIntent,
        TrinsicPendingIntentHelper.GetCallbackPendingIntentFlags()
);

TrinsicUI.LaunchSessionWithPendingIntent(
        MainActivity.this,
        launchUrl,
        resultPendingIntent
);
```

In the receiver, extract the result with `TrinsicPendingIntentHelper.GetAcceptanceSessionResult(intent)` and handle it the same way as the Activity Result callback.
