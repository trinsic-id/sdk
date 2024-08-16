package id.trinsic.connectandroid;

import android.net.Uri;

import androidx.activity.result.ActivityResultCaller;
import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;

import java.util.function.Consumer;

import id.trinsic.connectandroid.models.ConnectSessionParams;
import id.trinsic.connectandroid.models.ConnectSessionResult;

public class ConnectClient {
    private final ActivityResultLauncher<ConnectSessionParams> invokeLauncher;

    public ConnectClient(@NonNull ActivityResultCaller activity, @NonNull Consumer<ConnectSessionResult> callback) {
        invokeLauncher = activity.registerForActivityResult(new InvokeContract(), callback::accept);
    }

    public void Invoke(String launchUrl, String redirectScheme) {
        Uri parsedUrl = Uri.parse(launchUrl);
        String sessionId = parsedUrl.getQueryParameter("sessionId");
        invokeLauncher.launch(new ConnectSessionParams(sessionId, launchUrl, redirectScheme));
    }
}
