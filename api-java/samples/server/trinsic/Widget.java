package id.trinsic;

import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.CreateWidgetSessionRequest;
import io.javalin.Javalin;

import java.util.Map;

public class Widget{
    public static void WidgetRoutes(Javalin app, SessionsApi session){
        app.get("/widget", ctx -> {
           ctx.redirect("/widget.html");
        });

        app.post("/create-session", ctx -> {
            var redirectUrl = ctx.queryParam("redirectUrl");
            var request = new CreateWidgetSessionRequest();
            request.setRedirectUrl(redirectUrl);
            var result = session.createWidgetSession(request);
            Map<String, Object> response = Map.of(
                    "launchUrl", result.getLaunchUrl(),
                    "sessionId", result.getSessionId()
            );
            ctx.json(response);
        });
    }
}