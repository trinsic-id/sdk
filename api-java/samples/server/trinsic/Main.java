package id.trinsic;

import id.trinsic.api.NetworkApi;
import id.trinsic.api.SessionsApi;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        var dotenv = Dotenv.load();
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

        id.trinsic.Shared.SharedRoutes(app, network, session);
        id.trinsic.Widget.WidgetRoutes(app, session);
        id.trinsic.Hosted.HostedRoutes(app, session);


        app.start(3000);
    }
}

