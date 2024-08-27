package id.trinsic;

import id.trinsic.api.NetworkApi;
import id.trinsic.api.SessionsApi;
import id.trinsic.api.models.CreateSessionRequest;
import id.trinsic.api.models.GetSessionResultRequest;
import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

import java.net.URL;
import java.nio.file.Paths;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        var dotenv = Dotenv.load();
        var authToken = dotenv.get("TRINSIC_AUTH_TOKEN");

        if (authToken == null) {
            System.err.println("TRINSIC_AUTH_TOKEN is not set");
            System.exit(1);
        }

        var webUiPath = Paths.get("../web-ui").normalize().toString();

        var apiClient = new ApiClient();
        apiClient.setRequestInterceptor(interceptor -> {
            interceptor.setHeader("Authorization", "Bearer " + authToken);
        });

        var network = new NetworkApi(apiClient);
        var session = new SessionsApi(apiClient);

        var app = Javalin.create(javalinConfig -> {
            javalinConfig.staticFiles.add(staticFileConfig -> {
                staticFileConfig.hostedPath = "/";
                staticFileConfig.directory = webUiPath;
                staticFileConfig.location = Location.EXTERNAL;
            });
        });

        app.get("/providers", ctx -> {
            var providers = network.listProviders();
            ctx.json(providers);
        });

        app.get("/launch/{providerId}", ctx -> {
            var redirectUrl = ctx.queryParam("redirectUrl");
            var providerId = ctx.pathParam("providerId");

            var sessionRequest = new CreateSessionRequest();
            sessionRequest.setLaunchMethodDirectly(true);
            sessionRequest.setProviders(Arrays.asList(providerId));

            var result = session.createSession(sessionRequest);

            var url = new URL(result.getLaunchUrl() + "?redirectUrl=" + redirectUrl + "&sessionId=" + result.getSession().getId());

            ctx.redirect(url.toString());
        });

        app.post("/create-session", ctx -> {
            var result = session.createSession(new CreateSessionRequest());
            ctx.json(result);
        });

        app.post("/exchange-result", ctx -> {
            var body = ctx.bodyAsClass(ExchangeResultRequest.class);

            var request = new GetSessionResultRequest();
            request.setResultsAccessKey(body.resultsAccessKey);

            var result = session.getSessionResult(body.sessionId, request);

            ctx.json(result);
        });

        app.start(8080);
    }
}

