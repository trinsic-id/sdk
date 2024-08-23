package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
	trinsic_api "github.com/trinsic-id/sdk-go-api"
)

var api *trinsic_api.APIClient

func main() {
	authToken := os.Getenv("TRINSIC_AUTH_TOKEN")
	config := trinsic_api.NewConfiguration()
	config.AddDefaultHeader("Authorization", "Bearer "+authToken)
	api = trinsic_api.NewAPIClient(config)

	app := fiber.New()

	app.Static("/", "../web-ui")

	app.Get("/providers", func(c *fiber.Ctx) error {
		data, _, err := api.NetworkAPI.ListProviders(c.Context()).Execute()

		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(data)
	})

	app.Get("/launch/:providerId", func(c *fiber.Ctx) error {
		providerId := c.Params("providerId")
		launchDirectly := true

		request := trinsic_api.CreateSessionRequest{
			LaunchMethodDirectly: &launchDirectly,
			Providers:            []string{providerId},
		}

		data, _, err := api.SessionsAPI.CreateSession(c.Context()).CreateSessionRequest(request).Execute()

		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.Redirect(*data.LaunchUrl + "&redirectUrl=" + c.Query("redirectUrl"))
	})

	app.Post("/create-session", func(c *fiber.Ctx) error {
		request := trinsic_api.CreateSessionRequest{}

		req := api.SessionsAPI.CreateSession(c.Context()).CreateSessionRequest(request)
		_, _, err := req.Execute()

		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(nil)
	})

	type ExchangeResultsRequest struct {
		SessionId string `json:"sessionId"`
		AccessKey string `json:"resultsAccessKey"`
	}

	app.Post("/exchange-results", func(c *fiber.Ctx) error {
		exchangeRequest := new(ExchangeResultsRequest)

		if err := c.BodyParser(exchangeRequest); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		request := trinsic_api.ExchangeResultsKeyRequest{
			ResultsAccessKey: exchangeRequest.AccessKey,
		}

		data, _, err := api.SessionsAPI.ExchangeResultsKey(c.Context(), exchangeRequest.SessionId).ExchangeResultsKeyRequest(request).Execute()

		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(data)
	})

	app.Listen(":8080")
}
