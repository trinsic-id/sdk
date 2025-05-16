# Trinsic Android UI Library Sample

## Documentation

See the [Trinsic docs](https://docs.trinsic.id/docs/) for more detailed information on how to start integrating with our identity acceptance network.

## How This Sample Works

> [!IMPORTANT]  
> This sample, by default, *does not hit Trinsic's API* or perform real verifications. Instead, it uses a Trinsic-provided test API which allows for quick and convenient testing of the library's functionality **without** needing a real API key or a backend of your own.
> 
> Once you have implemented your own backend, this sample can easily be configured to perform real verifications simply by changing the `BACKEND_CREATE_SESSION_ENDPOINT` constant in `MainActivity.java` to point to your backend's endpoint.

This sample implements the Trinsic Android UI Library to the extent necessary to demonstrate the basic functionality of the library.

The relevant files for this sample are:
- [[....]/MainActivity.java](https://github.com/trinsic-id/sdk/blob/main/ui-android/samples/android_sample/app/src/main/java/id/trinsic/android_sample/MainActivity.java)
  - Implements the Trinsic UI library and handles the session result callback
- [app/src/main/AndroidManifest.xml](https://github.com/trinsic-id/sdk/blob/main/ui-android/samples/android_sample/app/src/main/AndroidManifest.xml)
  - Registers the custom URL scheme used to handle redirect responses
- [settings.gradle.kts](https://github.com/trinsic-id/sdk/blob/main/ui-android/samples/android_sample/settings.gradle.kts)
  - Adds jitpack as a Maven repository
- [app/build.gradle.kts](https://github.com/trinsic-id/sdk/blob/main/ui-android/samples/android_sample/app/build.gradle.kts)
  - Adds Trinsic Android SDK as a dependency

## Implementation Guide

Below is a step-by-step guide to understanding both A) what this sample does and B) how to implement its functionality into your own app.

### 1. Install and Configure the SDK

Follow the installation steps described in the [README](https://github.com/trinsic-id/sdk/blob/main/ui-android/README.md), including:
- Adding Jitpack to your Gradle repositories, if not present already
- Including the `sdk-android-ui` dependency
- Registering a custom URL scheme to handle redirect responses
- Updating your `AndroidManifest.xml` to include the required activity declaration pointing to your custom scheme

### 2. Prepare the Launch Activity

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
    } else if (!result.getSuccess()) {
        // Verification failed
    } else {
        // Verification succeeded; result.getResultsAccessKey() contains your key
    }
});
```

This callback will be invoked once the user finishes a Session -- whether it succeeds, fails, or is cancelled.

### 3. Obtain a Session Launch URL

You’ll need to make a call to your backend to create a new Trinsic Session and retrieve its `launchUrl`.

The sample app demonstrates this using a test-only endpoint (`https://api.trinsic.id/api/mobiletest/create-session`), but in production you'll want to use the [Trinsic API SDK](https://github.com/trinsic-id/sdk#api-libraries) on your backend to create a real Session and return the resulting `launchUrl` to your app.

Example flow:
1. User taps a “Verify Identity” button.
2. Your frontend makes a request to your backend.
3. Your backend calls Trinsic to create a session, and returns the `launchUrl` to the frontend.

### 4. Launch the Session

Once you’ve received the launch URL from your backend, invoke the Trinsic SDK:

```java
trinsicUI.LaunchSession(MainActivity.this, launchUrl);
```

This will launch an Android Custom Tab and guide the user through the identity verification flow. When complete, your previously defined callback will be triggered with the results.