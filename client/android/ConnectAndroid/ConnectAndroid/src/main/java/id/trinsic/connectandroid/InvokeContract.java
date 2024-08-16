package id.trinsic.connectandroid;

import android.content.Context;
import android.content.Intent;

import androidx.activity.result.contract.ActivityResultContract;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import id.trinsic.connectandroid.models.ConnectSessionParams;
import id.trinsic.connectandroid.models.ConnectSessionResult;

public class InvokeContract extends ActivityResultContract<ConnectSessionParams, ConnectSessionResult>
{
    @NonNull
    @Override
    public Intent createIntent(@NonNull Context context, ConnectSessionParams input) {
        Intent intent = new Intent(context, InvokeActivity.class);
        intent.putExtra("sessionId", input.getSessionId());
        intent.putExtra("launchUrl", input.getLaunchUrl());
        intent.putExtra("redirectScheme", input.getRedirectScheme());
        return intent;
    }

    @Override
    public ConnectSessionResult parseResult(int resultCode, @Nullable Intent intent) {
        if (intent != null) {
            return new ConnectSessionResult(
                    intent.getStringExtra("sessionId"),
                    intent.getStringExtra("resultsAccessKey"),
                    intent.getBooleanExtra("success", false),
                    intent.getBooleanExtra("canceled", false)
            );
        }

        return new ConnectSessionResult(null, null, false, false);
    }
}
