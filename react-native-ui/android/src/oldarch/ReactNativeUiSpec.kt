package com.trinsic.reactnativeui

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

abstract class ReactNativeUiSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun launchSession(launchUrl: String, callbackUrl: String, promise: Promise)
}
