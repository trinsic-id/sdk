package id.trinsic;

import id.trinsic.api.NetworkApi;
import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.GetSessionResultRequest;
import id.trinsic.api.models.RecommendationInfo;
import id.trinsic.api.models.RecommendRequest;
import id.trinsic.api.models.RecommendResponse;
import io.javalin.Javalin;

import java.util.List;

public class Shared{
    public static void SharedRoutes(Javalin app, NetworkApi network, SessionsApi session){
        app.get("/redirect", ctx -> {
            String query = ctx.queryString(); // grabs everything after '?'
            String target = "/redirect.html" + (query != null ? "?" + query : "");
            ctx.redirect(target);
        });

        app.get("/providers", ctx -> {
            // Get query param
            String ipAddress = ctx.queryParam("ipAddress");

            // Build request
            RecommendRequest req = new RecommendRequest();
            RecommendationInfo info = new RecommendationInfo();
            info.setIpAddresses(List.of(ipAddress)); // Assuming it's a list
            req.setRecommendationInfo(info);

            // Call the service
            RecommendResponse result = network.recommendProviders(req);

            // Return JSON response
            ctx.json(result);
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