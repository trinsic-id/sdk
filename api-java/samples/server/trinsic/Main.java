package id.trinsic;

import id.trinsic.api.NetworkApi;
import id.trinsic.api.SessionsApi;

import io.github.cdimascio.dotenv.DotenvBuilder;
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

import java.nio.file.Paths;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        var dotenv = new DotenvBuilder().ignoreIfMissing().load();
        var authToken = dotenv.get("TRINSIC_ACCESS_TOKEN");

        if (authToken == null) {
            System.err.println("TRINSIC_ACCESS_TOKEN is not set");
            System.exit(1);
        }

        var webUiPath = Paths.get("../../../ui-web/samples/dist").normalize().toString();

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
            javalinConfig.jsonMapper(new id.trinsic.CustomJacksonMapper());
        });

        // Global handler for Trinsic API errors
        app.exception(ApiException.class, (e, ctx) -> {
            e.printStackTrace();
            int status = e.getCode();
            String message = e.getMessage();

            // Optional: parse e.getResponseBody() if available and JSON
            ctx.status(status);
            ctx.json(Map.of(
                    "message", "Request failed: check logs for details.",
                    "error", message
            ));
        });

        // Optional: generic fallback
        app.exception(Exception.class, (e, ctx) -> {
            e.printStackTrace(); // or use logger
            ctx.status(500).json(Map.of(
                    "message", "Unexpected server error",
                    "error", e.getMessage()
            ));
        });

        id.trinsic.Shared.SharedRoutes(app, network, session);
        id.trinsic.Widget.WidgetRoutes(app, session);
        id.trinsic.Hosted.HostedRoutes(app, session);
        id.trinsic.Direct.DirectRoutes(app, session);


        app.start(3000);
    }
}

