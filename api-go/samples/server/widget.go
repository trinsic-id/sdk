package main

import (
	"github.com/gofiber/fiber/v2"
	"os"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v2"
)

func WidgetRoutes(app *fiber.App, api *trinsic_api.APIClient) {
	app.Get("/widget", func(c *fiber.Ctx) error {
		return c.Redirect("/widget.html")
	})

	app.Post("/create-widget-session", func(c *fiber.Ctx) error {
		redirectUrl := c.Query("redirectUrl")
		verificationProfileId := os.Getenv("TRINSIC_VERIFICATION_PROFILE_ID")
		// Create request with nullable redirectUrl
		request := trinsic_api.CreateWidgetSessionRequest{
			RedirectUrl: *trinsic_api.NewNullableString(&redirectUrl),
			VerificationProfileId: verificationProfileId,
		}

		req := api.SessionsAPI.CreateWidgetSession(c.Context()).CreateWidgetSessionRequest(request)
		data, _, err := req.Execute()

		if err != nil {
			return err
		}

		return c.JSON(data)
	})
}
