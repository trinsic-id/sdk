package id.trinsic;
import java.util.UUID;
import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.GetSessionResultRequest;
import id.trinsic.api.models.RecommendationInfo;
import id.trinsic.api.models.RecommendProvidersRequest;
import id.trinsic.api.models.RecommendProvidersResponse;
import io.javalin.Javalin;
import java.util.UUID;
import java.util.List;

public class Shared{
    public static void SharedRoutes(Javalin app, SessionsApi session, UUID verificationProfileId){

        app.get("/providers", ctx -> {
            // Get query param (now optional)
            String ipAddress = ctx.queryParam("ipAddress");

            // Build request
            RecommendProvidersRequest req = new RecommendProvidersRequest();
            req.setVerificationProfileId(verificationProfileId);

            // Only set recommendation info if IP address is provided
            if (ipAddress != null && !ipAddress.isEmpty()) {
                RecommendationInfo info = new RecommendationInfo();
                info.setIpAddresses(List.of(ipAddress));
                req.setRecommendationInfo(info);
            }

            // Call the service
            RecommendProvidersResponse result = session.recommendProviders(req);

            // Return JSON response
            ctx.json(result);
        });

        app.post("/exchange-result", ctx -> {
            var body = ctx.bodyAsClass(id.trinsic.ExchangeResultRequest.class);

            var request = new GetSessionResultRequest();
            request.setResultsAccessKey(body.resultsAccessKey);

            var result = session.getSessionResult(UUID.fromString(body.sessionId), request);

            ctx.json(result);
        });
    }
}