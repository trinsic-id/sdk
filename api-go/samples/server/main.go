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
	HostedRoutes(app, api)

	app.Listen(":3000")
}
