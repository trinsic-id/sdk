package id.trinsic.connectandroid;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.appcompat.app.AppCompatActivity;

public class InvokeActivity extends ComponentActivity {
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

        // Launch custom tab using parameters from intent
        Intent intent = getIntent();
        String dataString = getIntent().getDataString();
        Bundle extras = intent.getExtras();
        boolean hasExtras = extras != null && !extras.isEmpty();
        boolean hasData = dataString != null && !dataString.isEmpty();
        Log.i("InvokeActivity", "Incoming intent has extras: " + (hasExtras ? "true" : "false"));
        Log.i("InvokeActivity", "Incoming intent has data: " + (hasData ? "true" : "false"));

        if(hasExtras) {
            for(String key : extras.keySet()) {
                Log.i("InvokeActivity", "Extra [" + key + "]: " + extras.get(key));
            }
        }

        if(hasData) {
            Log.i("InvokeActivity", "Intent data: " + dataString);
            Log.i("InvokeActivity", "Intent has data, so interpreting this as a results scheme callback");
            handleResultsIntent(intent);
            return;
        }

        launchUrl = intent.getStringExtra("launchUrl");
        sessionId = intent.getStringExtra("sessionId");
        redirectScheme = intent.getStringExtra("redirectScheme");

        Uri uri = Uri.parse(launchUrl + (launchUrl.contains("?") ? "&" : "?") + "scheme=" + redirectScheme);
        customTabLauncher.launch(uri);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        Log.i("InvokeActivity", "Got onNewIntent");

        handleResultsIntent(intent);
    }

    private void handleResultsIntent(Intent intent) {
        Log.i("InvokeActivity", "handleResultsIntent called");
        Uri data = intent.getData();
        if (data == null) {
            Log.i("InvokeActivity", "handleResultsIntent intent has no data");
            return;
        }

        String sessionId = data.getQueryParameter("sessionId");
        String resultsAccessKey = data.getQueryParameter("resultsAccessKey");
        boolean success = data.getBooleanQueryParameter("success", false);

        handleResult(sessionId, resultsAccessKey, success, false);
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
