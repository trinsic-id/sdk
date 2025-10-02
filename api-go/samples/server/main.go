package main

import (
	"log"
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
	config.Debug = true
	api = trinsic_api.NewAPIClient(config)

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			// Log error to console
			log.Printf("[Error] %v\n", err)

			// Default to 500 if not set
			code := fiber.StatusInternalServerError

			// If it's a fiber.*Error, use its Code
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}

			return c.Status(code).JSON(fiber.Map{
				"message": "Request failed: check logs for details.",
				"error":   err.Error(),
			})
		},
	})

	SharedRoutes(app, api)
	WidgetRoutes(app, api)
	HostedRoutes(app, api)
	DirectRoutes(app, api)

	app.Listen(":3000")
}
