package main

import (
	"github.com/gofiber/fiber/v2"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v2"
)

func WidgetRoutes(app *fiber.App, api *trinsic_api.APIClient) {
	app.Get("/widget", func(c *fiber.Ctx) error {
		return c.Redirect("/widget.html")
	})

	app.Post("/create-session", func(c *fiber.Ctx) error {
		redirectUrl := c.Query("redirectUrl")

		// Create request with nullable redirectUrl
		request := trinsic_api.CreateWidgetSessionRequest{
			RedirectUrl: *trinsic_api.NewNullableString(&redirectUrl),
		}

		req := api.SessionsAPI.CreateWidgetSession(c.Context()).CreateWidgetSessionRequest(request)
		data, _, err := req.Execute()

		if err != nil {
			print(err.Error())
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(data)
	})
}
