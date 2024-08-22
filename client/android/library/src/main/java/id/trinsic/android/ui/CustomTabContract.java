package id.trinsic.android.ui;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import androidx.activity.result.contract.ActivityResultContract;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.browser.customtabs.CustomTabsIntent;

class CustomTabContract extends ActivityResultContract<Uri, Uri>
{
    @NonNull
    @Override
    public Intent createIntent(@NonNull Context context, Uri input) {
        CustomTabsIntent customTabsIntent = new CustomTabsIntent.Builder().build();
        Intent keepAliveIntent = new Intent(context, KeepAliveService.class);
        Intent intent = customTabsIntent.intent;
        intent.putExtra("android.support.customtabs.extra.KEEP_ALIVE", keepAliveIntent);
        intent.setData(input);
        return intent;
    }

    @Override
    public Uri parseResult(int resultCode, @Nullable Intent intent) {
        if (intent != null) {
            return intent.getData();
        }
        return null;
    }
}
