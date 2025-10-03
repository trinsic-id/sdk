package id.trinsic;

import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.CreateHostedProviderSessionRequest;
import id.trinsic.api.models.CreateHostedProviderSessionResponse;
import io.javalin.Javalin;
import java.util.UUID;
public class Hosted {
    public static void HostedRoutes(Javalin app, SessionsApi session, UUID verificationProfileId){

        app.post("/create-hosted-session/{provider}", ctx -> {
            // Get path parameter
            String provider = ctx.pathParam("provider");

            // Get query parameter
            String redirectUrl = ctx.queryParam("redirectUrl");

            // Build request object
            CreateHostedProviderSessionRequest req = new CreateHostedProviderSessionRequest();
            req.setRedirectUrl(redirectUrl);
            req.setProvider(provider);
            req.setVerificationProfileId(verificationProfileId);

            // Call the service
            CreateHostedProviderSessionResponse result = session.createHostedProviderSession(req);

            // Redirect to result URL
            ctx.json(result);
        });
    }
}
