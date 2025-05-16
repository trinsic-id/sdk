package main

import (
	"github.com/gofiber/fiber/v2"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v2"
)

func HostedRoutes(app *fiber.App, api *trinsic_api.APIClient) {
	app.Get("/hosted", func(c *fiber.Ctx) error {
		return c.Redirect("/hosted.html")
	})

	app.Get("/hosted-launch/:provider", func(c *fiber.Ctx) error {
		provider := c.Params("provider")
		redirectUrl := c.Query("redirectUrl")

		// Create request with provider and nullable redirectUrl
		request := trinsic_api.CreateHostedProviderSessionRequest{
			RedirectUrl: redirectUrl,
			Provider:    provider,
		}

		req := api.SessionsAPI.CreateHostedProviderSession(c.Context()).CreateHostedProviderSessionRequest(request)
		data, _, err := req.Execute()

		if err != nil {
			return err
		}

		return c.Redirect(data.GetLaunchUrl())
	})
}
