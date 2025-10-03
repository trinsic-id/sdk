package main

import (
	"log"
	"os"
	"path/filepath"

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

	// Use the middleware for serving static files if they exist
	app.Use("/", ServeFileIfExists("../../../ui-web/samples/dist"))

	SharedRoutes(app, api)
	WidgetRoutes(app, api)
	HostedRoutes(app, api)
	DirectRoutes(app, api)

	app.Listen(":3000")
}

func ServeFileIfExists(staticDir string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Build the absolute file path from the staticDir and request path
		filePath := filepath.Join(staticDir, c.Path())

		// Check if the file exists and is not a directory
		info, err := os.Stat(filePath)
		if err == nil && !info.IsDir() {
			return c.SendFile(filePath)
		} else {
			filePath = filepath.Join(staticDir, c.Path()+".html")
			info, err := os.Stat(filePath)
			if err == nil && !info.IsDir() {
				return c.SendFile(filePath)
			}
		}
		println("File not found:", filePath)

		// If not found, move to the next handler
		return c.Next()
	}
}