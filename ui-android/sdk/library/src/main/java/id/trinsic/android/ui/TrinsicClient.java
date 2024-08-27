package id.trinsic.android.ui;

import android.net.Uri;

import androidx.activity.result.ActivityResultCaller;
import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;

import java.util.function.Consumer;

import id.trinsic.android.ui.models.AcceptanceSessionLaunchParams;
import id.trinsic.android.ui.models.AcceptanceSessionResult;

/**
 * Client to invoke Trinsic in an Android application.
 *<br/><br/>
 * Must be used in the context of an Activity or a Fragment.
 * <br/><br/>
 * See Trinsic's documentation for setup instructions, including <b>required</b> changes to your app's AndroidManifest.xml file.
 */
public class TrinsicClient {
    private final ActivityResultLauncher<AcceptanceSessionLaunchParams> invokeLauncher;

    /**
     * Instantiate a TrinsicClient and register the event callback for session execution results.
     * <br/><br/>
     * Must be called in an Activity's constructor or a Fragment's initialization logic (eg `onCreateView`).
     *
     * @param activity The Activity or Fragment this TrinsicClient belongs to
     * @param callback A callback to capture the results of session invocation
     */
    public TrinsicClient(@NonNull ActivityResultCaller activity, @NonNull Consumer<AcceptanceSessionResult> callback) {
        invokeLauncher = activity.registerForActivityResult(new InvokeContract(), callback::accept);
    }

    /**
     * Invoke an Acceptance Session, launching an Android Custom Tabs view and capturing the result.
     * <br/><br/>
     * The result of session invocation is delivered via the callback registered in the `TrinsicClient` constructor.
     * @param launchUrl      The `launchUrl` returned in the Session creation backend API
     * @param redirectScheme The redirect scheme registered in your application's manifest, in accordance with Trinsic's documentation
     */
    public void Invoke(String launchUrl, String redirectScheme) {
        Uri parsedUrl = Uri.parse(launchUrl);
        String sessionId = parsedUrl.getQueryParameter("sessionId");

        if(!parsedUrl.getQueryParameterNames().contains("launchMode")) {
            launchUrl += "&launchMode=mobile";
        }

        if(!parsedUrl.getQueryParameterNames().contains("redirectUrl")) {
            launchUrl += "&redirectUrl=" + redirectScheme + ":///callback";
        }

        invokeLauncher.launch(new AcceptanceSessionLaunchParams(sessionId, launchUrl, redirectScheme));
    }
}
