package id.trinsic;

import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.*;
import io.javalin.Javalin;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

public class Direct {
    public static void DirectRoutes(Javalin app, SessionsApi session){
        app.get("/direct", ctx -> {
            ctx.redirect("/direct.html");
        });

        app.get("/direct-popup", ctx -> {
            String query = ctx.queryString(); // grabs everything after '?'
            String target = "/direct-popup.html" + (query != null ? "?" + query : "");
            ctx.redirect(target);
        });

        app.get("/direct-launch/{provider}", ctx -> {
            String provider = ctx.pathParam("provider");
            String redirectUrl = ctx.queryParam("redirectUrl");
            boolean fallbackToTrinsicUI = "true".equals(ctx.queryParam("fallbackToTrinsicUI"));

            // Build request
            CreateDirectProviderSessionRequest req = new CreateDirectProviderSessionRequest();
            req.setProvider(provider);
            req.setRedirectUrl(redirectUrl);
            req.setFallbackToHostedUI(fallbackToTrinsicUI);

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

            var nextStep = result.getNextStep();
            if (nextStep.getMethod().getValue().equals(IntegrationLaunchMethod.LAUNCH_BROWSER.getValue())) {
                ctx.redirect(nextStep.getContent());
            } else {
                boolean shouldRefresh = nextStep.getRefresh() != null;
                String refreshAfter = shouldRefresh
                        ? nextStep.getRefresh().getRefreshAfter().toString()
                        : Instant.now().toString();

                String redirectQuery = String.format(
                        "sessionId=%s&resultsAccessKey=%s&nextStep=%s&content=%s&shouldRefresh=%s&refreshAfter=%s",
                        URLEncoder.encode(result.getSessionId().toString(), StandardCharsets.UTF_8),
                        URLEncoder.encode(result.getResultCollection().getResultsAccessKey(), StandardCharsets.UTF_8),
                        URLEncoder.encode(nextStep.getMethod().getValue(), StandardCharsets.UTF_8),
                        URLEncoder.encode(nextStep.getContent(), StandardCharsets.UTF_8),
                        shouldRefresh,
                        URLEncoder.encode(refreshAfter, StandardCharsets.UTF_8)
                );

                ctx.redirect("/direct-popup?" + redirectQuery);
            }
        });

        app.post("/refresh-content/{sessionId}", ctx -> {
            String sessionId = ctx.pathParam("sessionId");

            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            String resultsAccessKey = (String) body.get("resultsAccessKey");

            RefreshStepContentRequest request = new RefreshStepContentRequest();
            request.setResultsAccessKey(resultsAccessKey);

            RefreshStepContentResponse result =
                    session.refreshStepContent(UUID.fromString(sessionId), request);

            ctx.json(result); // Or wrap it if you need `deep_transform`
        });

        app.post("/poll-results/{sessionId}", ctx -> {
            String sessionId = ctx.pathParam("sessionId");

            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            String resultsAccessKey = (String) body.get("resultsAccessKey");

            GetSessionResultRequest request = new GetSessionResultRequest();
            request.setResultsAccessKey(resultsAccessKey);

            GetSessionResultResponse result =
                    session.getSessionResult(sessionId, request);

            ctx.json(result); // Or wrap if needed
        });
    }
}
