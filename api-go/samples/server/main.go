package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
	trinsic_api "github.com/trinsic-id/sdk-go-api"
)

var api *trinsic_api.APIClient

func main() {
	authToken := os.Getenv("TRINSIC_ACCESS_TOKEN")
	config := trinsic_api.NewConfiguration()
	config.AddDefaultHeader("Authorization", "Bearer "+authToken)
	api = trinsic_api.NewAPIClient(config)

	app := fiber.New()

	app.Static("/", "../../ui-web/samples/dist")

	app.Get("/redirect", func(c *fiber.Ctx) error {
		return c.Redirect("/redirect.html")
	})

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
			LaunchProviderDirectly: &launchDirectly,
			Providers:              []string{providerId},
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
		data, _, err := req.Execute()

		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(data)
	})

	type GetResultsRequest struct {
		SessionId string `json:"sessionId"`
		AccessKey string `json:"resultsAccessKey"`
	}

	app.Post("/exchange-result", func(c *fiber.Ctx) error {
		req := new(GetResultsRequest)

		if err := c.BodyParser(req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		request := trinsic_api.GetSessionResultRequest{
			ResultsAccessKey: req.AccessKey,
		}

		data, _, err := api.SessionsAPI.GetSessionResult(c.Context(), req.SessionId).GetSessionResultRequest(request).Execute()

		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(data)
	})

	app.Listen(":8080")
}
