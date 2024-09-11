package id.trinsic.android_sample;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.os.StrictMode;
import android.util.Log;
import android.view.View;

import id.trinsic.android.ui.TrinsicUI;
import id.trinsic.android_sample.databinding.ActivityMainBinding;
import android.widget.Toast;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {
    // Replace the below with a URL that, when called with a GET request, will return a session launch URL as the only text content of the response.
    // It will likely do so by using the Trinsic backend API SDK to create a session and return the launch URL.
    private static String BACKEND_CREATE_SESSION_ENDPOINT = "[REPLACEME]";

    // Replace the below with a URL that uses a custom scheme that you've properly registered in your app's AndroidManifest.xml
    // The path (in this case "/callback") can be anything.
    private static String CALLBACK_REDIRECT_URL = "trinsic-android-ui-sample-redirect-scheme:///callback";

    private ActivityMainBinding binding;
    private TrinsicUI trinsicUI;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        trinsicUI = new TrinsicUI(this, (result) -> {
            if (result.getCanceled()) {
                // This happens if the user closed the Android Custom Tabs activity by hitting the "X" button or by hitting Back
                Toast.makeText(MainActivity.this, "User canceled", Toast.LENGTH_SHORT).show();
            } else if (!result.getSuccess()) {
                // This happens if the flow fails for any other reason
                Toast.makeText(MainActivity.this, "Failed", Toast.LENGTH_SHORT).show();
            } else {
                // This happens if the user's identity has been verified
                Toast.makeText(MainActivity.this, "ResultsAccessKey: " + result.getResultsAccessKey(), Toast.LENGTH_SHORT).show();
            }
        });

        binding.buttonLaunch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("OnClick", "Invoking Trinsic client");
                String launchUrl;
                try {
                    launchUrl = createLaunchUrl();
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Failed to create launch URL: " + e.getMessage(), Toast.LENGTH_LONG);
                    throw new RuntimeException(e);
                }

                trinsicUI.Invoke(launchUrl, CALLBACK_REDIRECT_URL);
            }
        });
    }

    private String createLaunchUrl() throws Exception {
        // Horrible hack to allow us to do networking on the UI thread since this is a simple sample
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        StringBuilder result = new StringBuilder();
        HttpURLConnection conn = (HttpURLConnection) new URL(BACKEND_CREATE_SESSION_ENDPOINT).openConnection();
        conn.setRequestMethod("GET");

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            String line;
            while((line = reader.readLine()) != null) {
                result.append(line);
            }
        }

        return result.toString();
    }
}