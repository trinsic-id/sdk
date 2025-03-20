import { SessionsApi } from "@trinsic/api";
import path from "path";
import {Express} from "express"

export function hostedRoutes(app: Express, sessionsApi: SessionsApi) {
    app.get("/hosted", (req: any, res: any) => {
        res.sendFile(
            path.join(__dirname, "../../../../ui-web/samples/dist/hosted.html")
        );
    });

    app.get("/hosted-launch/:provider", async (req: any, res: any) => {
        const provider = req.params.provider;
        const redirectUrl = req.query.redirectUrl;

        const result = await sessionsApi.createHostedProviderSession({
            provider: provider,
            redirectUrl: redirectUrl
        });
        res.redirect(result.launchUrl);
    });
}