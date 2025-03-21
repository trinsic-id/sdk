package id.trinsic;

import id.trinsic.api.NetworkApi;
import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.GetSessionResultRequest;
import io.javalin.Javalin;

public class Shared{
    public static void SharedRoutes(Javalin app, NetworkApi network, SessionsApi session){
        app.get("/redirect", ctx -> {
            String query = ctx.queryString(); // grabs everything after '?'
            String target = "/redirect.html" + (query != null ? "?" + query : "");
            ctx.redirect(target);
        });
        app.get("/providers", ctx -> {
            var providers = network.listProviders();
            ctx.json(providers);
        });

        app.post("/exchange-result", ctx -> {
            var body = ctx.bodyAsClass(id.trinsic.ExchangeResultRequest.class);

            var request = new GetSessionResultRequest();
            request.setResultsAccessKey(body.resultsAccessKey);

            var result = session.getSessionResult(body.sessionId, request);

            ctx.json(result);
        });
    }
}