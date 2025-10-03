package id.trinsic;

import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.CreateWidgetSessionRequest;
import io.javalin.Javalin;
import java.util.UUID;
import java.util.Map;

public class Widget{
    public static void WidgetRoutes(Javalin app, SessionsApi session, UUID verificationProfileId){

        app.post("/create-widget-session", ctx -> {
            var redirectUrl = ctx.queryParam("redirectUrl");
            var request = new CreateWidgetSessionRequest();
            request.setRedirectUrl(redirectUrl);
            request.setVerificationProfileId(verificationProfileId);
            var result = session.createWidgetSession(request);
            ctx.json(result);
        });
    }
}