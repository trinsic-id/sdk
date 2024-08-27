package com.trinsic.reactnativeui

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import id.trinsic.android.ui.InvokeContract
import id.trinsic.android.ui.models.AcceptanceSessionLaunchParams

class ReactNativeUiModule internal constructor(context: ReactApplicationContext) :
  ReactNativeUiSpec(context) {

  private val invokeContract = InvokeContract();

  private val activityEventListener =
    object : BaseActivityEventListener() {
      override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        intent: Intent?
      ) {
        if(intent == null
          || !intent.hasExtra("sessionId")
          || !intent.hasExtra("resultsAccessKey")
          || !intent.hasExtra("success")
          || !intent.hasExtra("canceled")) {
          return;
        }

        val sessionId = intent.getStringExtra("sessionId");
        val resultsAccessKey = intent.getStringExtra("resultsAccessKey");
        val success = intent.getBooleanExtra("success", false);
        val canceled = intent.getBooleanExtra("canceled", false);

        val callback = Callbacks.remove(sessionId);
        if(callback != null) {
          val ret = Arguments.createMap()
          ret.putString("sessionId", sessionId)
          ret.putString("resultsAccessKey", resultsAccessKey)
          ret.putBoolean("success", success)
          ret.putBoolean("canceled", canceled)
          callback.resolve(ret)
        }
      }
    }

  init {
    context.addActivityEventListener(activityEventListener);
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun launchSession(launchUrl: String, callbackUrl: String, promise: Promise) {
    val parsedUrl = Uri.parse(launchUrl);
    if(!parsedUrl.queryParameterNames.contains("sessionId")) {
      promise.reject("E_NO_SESSION_ID", "Launch URL has no session ID");
      return;
    }

    val sessionId = parsedUrl.getQueryParameter("sessionId")!!
    var newLaunchUrl = launchUrl
    if (!parsedUrl.queryParameterNames.contains("launchMode")) {
      newLaunchUrl += "&launchMode=mobile"
    }

    if (!parsedUrl.queryParameterNames.contains("redirectUrl")) {
      newLaunchUrl += "&redirectUrl=$callbackUrl"
    }

    Callbacks[sessionId] = promise;

    val launchParams : AcceptanceSessionLaunchParams = AcceptanceSessionLaunchParams(sessionId, newLaunchUrl, "trinsic-ui-example-redirect-scheme-react-native");
    currentActivity?.startActivityForResult(currentActivity?.let { invokeContract.createIntent(it, launchParams) }, 1)
  }

  companion object {
    val Callbacks = HashMap<String, Promise>()
    const val NAME = "ReactNativeUi"
  }
}
