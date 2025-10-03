package id.trinsic;
import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.File;
import java.nio.file.Paths;
import java.io.Console;
public class StaticFileMiddleware implements Handler {

    private final String staticDir;

    public StaticFileMiddleware(String staticDir) {
        this.staticDir = staticDir;
    }

    @Override
    public void handle(Context ctx) throws Exception {
        String requestedPath = ctx.path(); // e.g. "/redirect"
        String filePath = Paths.get(staticDir, requestedPath).toString();

        if(requestedPath.equals("/")) {
            filePath = Paths.get(staticDir, "index.html").toString();
        }

        File file = new File(filePath);
        if (file.exists() && file.isFile()) {
            ctx.result(new FileInputStream(file));
            ctx.contentType(getMimeType(file.getName()));
            ctx.status(200);
            return;
        } else {
            filePath = Paths.get(staticDir, requestedPath + ".html").toString();
            file = new File(filePath);
            if (file.exists() && file.isFile()) {
                ctx.result(new FileInputStream(file));
                ctx.contentType(getMimeType(file.getName()));
                ctx.status(200);
                return;
            }
        }
    }
    private String getMimeType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".html")) return "text/html";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".js")) return "application/javascript";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }
}