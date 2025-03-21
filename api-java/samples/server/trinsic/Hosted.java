package id.trinsic;

import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.CreateHostedProviderSessionRequest;
import id.trinsic.api.models.CreateHostedProviderSessionResponse;
import io.javalin.Javalin;

public class Hosted {
    public static void HostedRoutes(Javalin app, SessionsApi session){
        app.get("/hosted", ctx -> {
            ctx.redirect("/hosted.html");
        });

        app.get("/hosted-launch/{provider}", ctx -> {
            // Get path parameter
            String provider = ctx.pathParam("provider");

            // Get query parameter
            String redirectUrl = ctx.queryParam("redirectUrl");

            // Build request object
            CreateHostedProviderSessionRequest req = new CreateHostedProviderSessionRequest();
            req.setRedirectUrl(redirectUrl);
            req.setProvider(provider);

            // Call the service
            CreateHostedProviderSessionResponse result = session.createHostedProviderSession(req);

            // Redirect to result URL
            ctx.redirect(result.getLaunchUrl());
        });
    }
}
