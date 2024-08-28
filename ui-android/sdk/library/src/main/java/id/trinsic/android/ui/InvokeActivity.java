package id.trinsic.android.ui;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;

public class InvokeActivity extends ComponentActivity {
    public static String ACTION_INVOKE = "invoke";
    public static String ACTION_CALLBACK = "callback";

    private ActivityResultLauncher<Uri> customTabLauncher;
    private String launchUrl;
    private String sessionId;
    private String redirectScheme;
    private final Handler handler = new Handler();
    private Runnable r;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.i("InvokeActivity", "InvokeActivity launched");

        // Register for Custom Tabs activity result -- this indicates the user closing the tab themselves (canceling)
        customTabLauncher = registerForActivityResult(new CustomTabContract(),
        new ActivityResultCallback<Uri>() {
            @Override
            public void onActivityResult(Uri o) {
                Log.i("InvokeActivity", "Got onActivityResult");
                if (r == null) {
                    r = InvokeActivity.this::sessionCanceledCallback;
                    handler.postDelayed(r, 100);
                }
            }
        });

        handleInitializingIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleInitializingIntent(intent);
    }

    private void handleInitializingIntent(Intent intent) {
        if(intent.getAction() == null) {
            finishAndRemoveTask();
        }
        else if(intent.getAction().equals(ACTION_INVOKE)) {
            handleInvokeIntent(intent);
        } else if(intent.getAction().equals(ACTION_CALLBACK)) {
            handleCallbackIntent(intent);
        }
    }

    private void handleInvokeIntent(Intent intent) {
        launchUrl = intent.getStringExtra("launchUrl");
        sessionId = intent.getStringExtra("sessionId");
        redirectScheme = intent.getStringExtra("redirectScheme");

        Uri uri = Uri.parse(launchUrl + (launchUrl.contains("?") ? "&" : "?") + "scheme=" + redirectScheme);
        customTabLauncher.launch(uri);
    }

    private void handleCallbackIntent(Intent intent) {
        Log.i("InvokeActivity", "handleResultsIntent called");
        if(!intent.hasExtra("sessionId") || !intent.hasExtra("success")) {
            return;
        }

        String sessionId = intent.getStringExtra("sessionId");
        String resultsAccessKey = intent.getStringExtra("resultsAccessKey");
        boolean success = intent.getBooleanExtra("success", false);
        boolean canceled = intent.getBooleanExtra("canceled", false);

        handleResult(sessionId, resultsAccessKey, success, canceled);
    }

    private void handleResult(String sessionId, String resultsAccessKey, boolean success, boolean canceled) {
        Log.i("InvokeActivity", "handleResult() called");
        if (r != null) {
            handler.removeCallbacks(r);
        }

        int resultCode = canceled ? RESULT_CANCELED : (success ? RESULT_OK : 2); // TODO: magic error number

        Intent intent = new Intent();
        intent.putExtra("sessionId", sessionId);
        intent.putExtra("resultsAccessKey", resultsAccessKey);
        intent.putExtra("success", success);
        intent.putExtra("canceled", canceled);

        setResult(resultCode, intent);
        finishAndRemoveTask();
    }

    private void sessionCanceledCallback() {
        handleResult(sessionId, null, false, true);
    }
}
