package id.trinsic;
import java.util.UUID;
import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.*;
import io.javalin.Javalin;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

public class Direct {
    public static void DirectRoutes(Javalin app, SessionsApi session, UUID verificationProfileId){

        app.get("/direct-popup", ctx -> {
            String query = ctx.queryString(); // grabs everything after '?'
            String target = "/direct-popup.html" + (query != null ? "?" + query : "");
            ctx.redirect(target);
        });

        app.post("/create-direct-session/{provider}", ctx -> {
            String provider = ctx.pathParam("provider");
            String redirectUrl = ctx.queryParam("redirectUrl");
            boolean fallbackToTrinsicUI = "true".equals(ctx.queryParam("fallbackToTrinsicUI"));

            // Build request
            CreateDirectProviderSessionRequest req = new CreateDirectProviderSessionRequest();
            req.setProvider(provider);
            req.setRedirectUrl(redirectUrl);
            req.setFallbackToHostedUI(fallbackToTrinsicUI);
            req.setVerificationProfileId(verificationProfileId);

            String capabilitiesParam = ctx.queryParam("capabilities");
            List<IntegrationCapability> capabilities = capabilitiesParam != null
                    ? Arrays.stream(capabilitiesParam.split(","))
                    .map(String::trim)
                    .map(IntegrationCapability::fromValue)
                    .collect(Collectors.toList())
                    : List.of();

            req.setCapabilities(capabilities);

            // Call API
            CreateDirectProviderSessionResponse result =
                    session.createDirectProviderSession(req);

            ctx.json(result);
        });

        app.post("/refresh-content/{sessionId}", ctx -> {
            String sessionId = ctx.pathParam("sessionId");

            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            String resultsAccessKey = (String) body.get("resultsAccessKey");

            RefreshStepContentRequest request = new RefreshStepContentRequest();
            request.setResultsAccessKey(resultsAccessKey);

            RefreshStepContentResponse result =
                    session.refreshStepContent(UUID.fromString(sessionId), request);

            ctx.json(result);
        });

        app.post("/poll-results/{sessionId}", ctx -> {
            String sessionId = ctx.pathParam("sessionId");

            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            String resultsAccessKey = (String) body.get("resultsAccessKey");

            GetSessionResultRequest request = new GetSessionResultRequest();
            request.setResultsAccessKey(resultsAccessKey);

            GetSessionResultResponse result =
                    session.getSessionResult(UUID.fromString(sessionId), request);

            ctx.json(result);
        });
    }
}
