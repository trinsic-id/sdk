package id.trinsic.android_sample;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.os.StrictMode;
import android.util.Log;
import android.view.View;

import id.trinsic.android.ui.TrinsicUI;
import id.trinsic.android.ui.alpha.TrinsicMdl;
import id.trinsic.android_sample.databinding.ActivityMainBinding;

import android.widget.Toast;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {
    /**
     * The custom redirect scheme you've chosen to use.
     * <p>
     * This is only used to construct the BACKEND_CREATE_SESSION_ENDPOINT url, which is a testing utility, not a core part of an integration.
     */
    private static String CUSTOM_REDIRECT_SCHEME = "trinsic-android-ui-sample-redirect-scheme";

    /**
     * Replace the below with a URL that, when called with a GET request, will return a session launch URL as the only text content of the response.
     * It will likely do so by using the Trinsic backend API SDK to create a session and return the launch URL.
     * NOTE: The default value here points to a Trinsic-hosted mobile tester page, which provides simple functionality to easily test
     * your integration *without* having to use Trinsic's actual backend API. This does not create actual Sessions in Trinsic's platform.
     */
    private static String BACKEND_CREATE_SESSION_ENDPOINT = "https://api.trinsic.id/api/mobiletest/create-session?redirectScheme=" + CUSTOM_REDIRECT_SCHEME;


    /**
     * A request object as retrieved from Trinsic's CreateMdlExchange API.
     * <p>
     * Specific to the mDL sample.
     */
    private static String MDL_REQUEST_OBJECT_BASE64URL = "";

    /**
     * The TrinsicUI instance, which will be used to launch a Hosted or Widget session.
     * <p>
     * Not used for Advanced Sessions, or for mDL Exchanges.
     */
    private TrinsicUI trinsicUI;

    private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Misc. setup, unrelated to Trinsic SDK
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        /** Set up Trinsic Session Sample **/

        // Set up Trinsic SDK, specifying a callback which will be called when a launched Session is resolved.
        // This does not launch a Session; it only prepares the SDK to launch one.
        // NOTE: This registers an activity callback listener, so it *must always* be called by this method.
        // Do not conditionally call this.
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

        // When the "Launch Trinsic Session" button is tapped,
        // fetch a Session URL, and then invoke the Trinsic SDK with it
        binding.buttonLaunch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("OnClick", "Invoking Trinsic client");

                try {
                    // Fetch a session URL
                    String launchUrl = createLaunchUrl();

                    // Launch the Session with the Trinsic SDK.
                    // When the Session is completed (successfully or unsuccessfully), your app
                    // will be notified via the callback you specified when constructing a new TrinsicUI() above.
                    trinsicUI.LaunchSession(MainActivity.this, launchUrl);
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Failed to create launch URL: " + e.getMessage(), Toast.LENGTH_LONG);
                    throw new RuntimeException(e);
                }
            }
        });

        /** Set up Trinsic mDL Exchange Sample */
        if (MDL_REQUEST_OBJECT_BASE64URL.isEmpty()) {
            binding.buttonLaunchMdl.setVisibility(View.INVISIBLE);
        } else {
            binding.buttonLaunchMdl.setOnClickListener((View v) -> {
                // When the "Launch mDL Exchange" button is pressed, use the Trinsic mDL SDK to
                // perform an exchange using a requestObject received from Trinsic's API (or hardcoded, in this case).
                TrinsicMdl.performMdlExchange(MainActivity.this, MDL_REQUEST_OBJECT_BASE64URL, (result) -> {
                    if (result.getSuccess()) {
                        String token = result.getToken(); // Send this token to your backend to send it to Trinsic.
                        Toast.makeText(MainActivity.this, "Got mDL Callback for Exchange " + result.getExchangeId() + ": " + token, Toast.LENGTH_LONG).show();
                    } else {
                        String exceptionMessage = result.getException().getMessage();
                        Toast.makeText(MainActivity.this, "Got error: " + exceptionMessage, Toast.LENGTH_LONG).show();
                    }
                });
            });
        }
    }

    private String createLaunchUrl() throws Exception {
        // Create a maximally-permissive Thread Policy, as we are using an inefficient / unrecommended method
        // of making an HTTP request.
        // In a real app, this request should be done using a proper HTTP request flow,
        // and you should not create a thread policy as we are here.
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        StringBuilder result = new StringBuilder();
        HttpURLConnection conn = (HttpURLConnection) new URL(BACKEND_CREATE_SESSION_ENDPOINT).openConnection();
        conn.setRequestMethod("GET");

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line);
            }
        }

        return result.toString();
    }
}