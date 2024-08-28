package id.trinsic.android.ui;

import android.app.ActivityManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultLauncher;

import java.util.List;

public class CallbackActivity extends ComponentActivity {
    private ActivityResultLauncher<Uri> customTabLauncher;
    private String launchUrl;
    private String sessionId;
    private String redirectScheme;
    private final Handler handler = new Handler();
    private Runnable r;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.i("CallbackActivity", "CallbackActivity launched");

        Intent intent = getIntent();
        Uri data = intent.getData();
        if (data == null) {
            Log.i("CallbackActivity", "intent has no data");
            return;
        }

        String sessionId = data.getQueryParameter("sessionId");
        String resultsAccessKey = data.getQueryParameter("resultsAccessKey");
        boolean success = data.getBooleanQueryParameter("success", false);

        Intent callbackIntent = new Intent(this, InvokeActivity.class);
        callbackIntent.setAction(InvokeActivity.ACTION_CALLBACK);
        callbackIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        callbackIntent.putExtra("sessionId", sessionId);
        callbackIntent.putExtra("resultsAccessKey", resultsAccessKey);
        callbackIntent.putExtra("success", success);
        callbackIntent.putExtra("canceled", false);

        ActivityManager mngr = (ActivityManager) getSystemService( ACTIVITY_SERVICE );
        List<ActivityManager.AppTask> taskList = mngr.getAppTasks();

        startActivity(callbackIntent);
    }
}
