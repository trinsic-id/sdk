package id.trinsic.android_sample;

import android.os.Bundle;

import id.trinsic.android.ui.TrinsicClient;

import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.View;
import android.widget.Toast;

import id.trinsic.android_sample.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;
    private static String LAUNCH_URL = "https://josh.trinsic-local.com/api/mobiletest?sessionId=1234";

    private TrinsicClient trinsicClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        trinsicClient = new TrinsicClient(this, (result) -> {
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
                trinsicClient.Invoke(LAUNCH_URL, "trinsic-testbed");
            }
        });
    }
}