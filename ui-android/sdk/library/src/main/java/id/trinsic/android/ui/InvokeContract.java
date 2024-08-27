package id.trinsic.android.ui;

import android.content.Context;
import android.content.Intent;

import androidx.activity.result.contract.ActivityResultContract;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import id.trinsic.android.ui.models.AcceptanceSessionLaunchParams;
import id.trinsic.android.ui.models.AcceptanceSessionResult;

/**
 * Internal class for Trinsic SDK usage
 */
public class InvokeContract extends ActivityResultContract<AcceptanceSessionLaunchParams, AcceptanceSessionResult>
{
    @NonNull
    @Override
    public Intent createIntent(@NonNull Context context, AcceptanceSessionLaunchParams input) {
        Intent intent = new Intent(context, InvokeActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        intent.setAction(InvokeActivity.ACTION_INVOKE);
        intent.putExtra("sessionId", input.getSessionId());
        intent.putExtra("launchUrl", input.getLaunchUrl());
        intent.putExtra("redirectScheme", input.getRedirectScheme());
        return intent;
    }

    @Override
    public AcceptanceSessionResult parseResult(int resultCode, @Nullable Intent intent) {
        if (intent != null) {
            return new AcceptanceSessionResult(
                    intent.getStringExtra("sessionId"),
                    intent.getStringExtra("resultsAccessKey"),
                    intent.getBooleanExtra("success", false),
                    intent.getBooleanExtra("canceled", false)
            );
        }

        return new AcceptanceSessionResult(null, null, false, false);
    }
}
