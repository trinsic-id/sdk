package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v2"
)

var api *trinsic_api.APIClient

func main() {
	authToken := os.Getenv("TRINSIC_ACCESS_TOKEN")
	config := trinsic_api.NewConfiguration()
	config.AddDefaultHeader("Authorization", "Bearer "+authToken)
	api = trinsic_api.NewAPIClient(config)

	app := fiber.New()

	SharedRoutes(app, api)
	WidgetRoutes(app, api)

	// app.Get("/launch/:providerId", func(c *fiber.Ctx) error {
	// 	providerId := c.Params("providerId")
	// 	launchDirectly := true

	// 	request := trinsic_api.CreateSessionRequest{
	// 		LaunchProviderDirectly: &launchDirectly,
	// 		Providers:              []string{providerId},
	// 	}

	// 	data, _, err := api.SessionsAPI.CreateSession(c.Context()).CreateSessionRequest(request).Execute()

	// 	if err != nil {
	// 		return c.Status(500).JSON(fiber.Map{
	// 			"error": err.Error(),
	// 		})
	// 	}

	// 	return c.Redirect(*data.LaunchUrl + "&redirectUrl=" + c.Query("redirectUrl"))
	// })

	app.Listen(":3000")
}
