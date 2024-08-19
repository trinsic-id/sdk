package id.trinsic.connectandroidsample;

import android.os.Bundle;

import id.trinsic.connectandroid.ConnectClient;
import id.trinsic.connectandroidsample.R;
import com.google.android.material.snackbar.Snackbar;

import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import id.trinsic.connectandroidsample.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;
    private static String LAUNCH_URL = "https://google.com";

    private ConnectClient connectClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        connectClient = new ConnectClient(this, (result) -> {
            if (result.getCanceled()) {
                Toast.makeText(MainActivity.this, "User canceled", Toast.LENGTH_SHORT).show();
            } else if (!result.getSuccess()) {
                Toast.makeText(MainActivity.this, "Failed", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(MainActivity.this, "ResultsAccessKey: " + result.getResultsAccessKey(), Toast.LENGTH_SHORT).show();
            }
        });

        binding.buttonLaunch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("OnClick", "Invoking connect client");
                connectClient.Invoke(LAUNCH_URL, "trinsic-testbed");
            }
        });
    }
}