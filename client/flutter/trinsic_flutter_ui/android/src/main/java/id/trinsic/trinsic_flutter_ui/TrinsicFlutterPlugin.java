package id.trinsic.trinsic_flutter_ui;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.HashMap;
import java.util.Map;

import id.trinsic.android.ui.InvokeContract;
import id.trinsic.android.ui.models.AcceptanceSessionLaunchParams;
import id.trinsic.android.ui.models.AcceptanceSessionResult;
import io.flutter.embedding.engine.plugins.FlutterPlugin;
import io.flutter.embedding.engine.plugins.activity.ActivityAware;
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.MethodChannel.MethodCallHandler;
import io.flutter.plugin.common.MethodChannel.Result;
import io.flutter.plugin.common.PluginRegistry;

/**
 * TrinsicFlutterPlugin
 */
public class TrinsicFlutterPlugin implements FlutterPlugin, ActivityAware, MethodCallHandler {
    private MethodChannel channel;

    private Context context;

    private ActivityPluginBinding activityPluginBinding;

    private Map<String, Result> callbacks = new HashMap<>();

    private static InvokeContract invokeContract = new InvokeContract();


    @Override
    public void onAttachedToActivity(@NonNull ActivityPluginBinding activityPluginBinding) {
        attachToActivity(activityPluginBinding);
    }

    @Override
    public void onDetachedFromActivityForConfigChanges() {
        disposeActivity();
    }

    @Override
    public void onReattachedToActivityForConfigChanges(
            @NonNull ActivityPluginBinding activityPluginBinding) {
        attachToActivity(activityPluginBinding);
    }

    @Override
    public void onDetachedFromActivity() {
        disposeActivity();
    }

    private void attachToActivity(ActivityPluginBinding activityPluginBinding) {
        this.activityPluginBinding = activityPluginBinding;
        this.activityPluginBinding.addActivityResultListener(new PluginRegistry.ActivityResultListener() {
            @Override
            public boolean onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
                for(String intentKey : data.getExtras().keySet()) {

                }

                AcceptanceSessionResult result = invokeContract.parseResult(resultCode, data);
                if(result != null && result.getSessionId() != null && callbacks.containsKey(result.getSessionId())) {
                    Map<String, Object> returnVal = new HashMap<>();
                    returnVal.put("sessionId", result.getSessionId());
                    returnVal.put("resultsAccessKey", result.getResultsAccessKey());
                    returnVal.put("success", result.getSuccess());
                    returnVal.put("canceled", result.getCanceled());
                    callbacks.remove(result.getSessionId()).success(returnVal);
                }

                return true;
            }
        });
    }

    private void disposeActivity() {
        activityPluginBinding = null;
    }

    @Override
    public void onAttachedToEngine(@NonNull FlutterPluginBinding flutterPluginBinding) {
        callbacks.clear();
        context = flutterPluginBinding.getApplicationContext();
        channel = new MethodChannel(flutterPluginBinding.getBinaryMessenger(), "trinsic_flutter_ui");
        channel.setMethodCallHandler(this);
    }

    @Override
    public void onMethodCall(@NonNull MethodCall call, @NonNull Result result) {
        if (call.method.equals("getPlatformVersion")) {
            result.success("Android " + android.os.Build.VERSION.RELEASE);
            return;
        }

        if (call.method.equals("invoke") && call.hasArgument("launchUrl")) {
            String launchUrl = call.argument("launchUrl");
            String redirectScheme = call.argument("redirectScheme");

            Uri parsedUrl = Uri.parse(call.argument("launchUrl"));
            if (!parsedUrl.getQueryParameterNames().contains("sessionId")) {
                result.error("invalid_url", "Invalid launch URL", null);
                return;
            }
            String sessionId = parsedUrl.getQueryParameter("sessionId");

            if(!parsedUrl.getQueryParameterNames().contains("launchMode")) {
                launchUrl += "&launchMode=mobile";
            }

            if(!parsedUrl.getQueryParameterNames().contains("redirectUrl")) {
                launchUrl += "&redirectUrl=" + redirectScheme + ":///callback";
            }

            // TODO: race condition prevention on `callbacks`?
            callbacks.put(sessionId, result);

            AcceptanceSessionLaunchParams launchParams = new AcceptanceSessionLaunchParams(sessionId, launchUrl, redirectScheme);
            activityPluginBinding.getActivity().startActivityForResult(invokeContract.createIntent(context, launchParams), 1);
            return;
        }

        result.notImplemented();
    }

    @Override
    public void onDetachedFromEngine(@NonNull FlutterPluginBinding binding) {
        callbacks.clear();
        context = null;
        channel.setMethodCallHandler(null);
    }
}
