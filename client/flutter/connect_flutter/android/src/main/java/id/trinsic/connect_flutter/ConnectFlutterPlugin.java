package id.trinsic.connect_flutter;

import android.content.Context;
import android.net.Uri;
import android.widget.Toast;

import androidx.activity.result.ActivityResultCaller;
import androidx.annotation.NonNull;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import id.trinsic.connectandroid.ConnectClient;
import io.flutter.embedding.engine.plugins.FlutterPlugin;
import io.flutter.embedding.engine.plugins.activity.ActivityAware;
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.MethodChannel.MethodCallHandler;
import io.flutter.plugin.common.MethodChannel.Result;

/**
 * ConnectFlutterPlugin
 */
public class ConnectFlutterPlugin implements FlutterPlugin, ActivityAware, MethodCallHandler {
    /// The MethodChannel that will the communication between Flutter and native Android
    ///
    /// This local reference serves to register the plugin with the Flutter Engine and unregister it
    /// when the Flutter Engine is detached from the Activity
    private MethodChannel channel;

    private Context context;

    private ActivityPluginBinding activityPluginBinding;

    private ConnectClient connectClient;

    private Map<String, Result> callbacks = new HashMap<>();

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
        connectClient = new ConnectClient((ActivityResultCaller) activityPluginBinding.getActivity(), result -> {
            Toast.makeText(context, "abcd", Toast.LENGTH_SHORT).show();

            if (callbacks.containsKey(result.getSessionId())) {
                Map<String, Object> returnVal = new HashMap<>();
                returnVal.put("sessionId", result.getSessionId());
                returnVal.put("resultsAccessKey", result.getResultsAccessKey());
                returnVal.put("success", result.getSuccess());
                returnVal.put("canceled", result.getCanceled());
                callbacks.remove(result.getSessionId()).success(returnVal);
            }
        });
    }

    private void disposeActivity() {
        connectClient = null;
        activityPluginBinding = null;
    }

    @Override
    public void onAttachedToEngine(@NonNull FlutterPluginBinding flutterPluginBinding) {
        callbacks.clear();
        context = flutterPluginBinding.getApplicationContext();
        channel = new MethodChannel(flutterPluginBinding.getBinaryMessenger(), "connect_flutter");
        channel.setMethodCallHandler(this);
    }

    @Override
    public void onMethodCall(@NonNull MethodCall call, @NonNull Result result) {
        if (call.method.equals("getPlatformVersion")) {
            result.success("Android2 " + android.os.Build.VERSION.RELEASE);
            return;
        }

        if (call.method.equals("invokeSession") && call.hasArgument("launchUrl")) {
            Uri parsedUrl = Uri.parse(call.argument("launchUrl"));
            if (!parsedUrl.getQueryParameterNames().contains("sessionId")) {
                result.error("invalid_url", "Invalid launch URL", null);
                return;
            }

            // TODO: race condition prevention on `callbacks`?
            String sessionId = parsedUrl.getQueryParameter("sessionId");
            callbacks.put(sessionId, result);

            connectClient.Invoke(call.argument("launchUrl"), call.argument("redirectScheme"));
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
