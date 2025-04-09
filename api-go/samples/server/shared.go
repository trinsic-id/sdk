package main

import (
	"github.com/gofiber/fiber/v2"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v2"
)

func SharedRoutes(app *fiber.App, api *trinsic_api.APIClient) {
	app.Static("/", "../../../ui-web/samples/dist")

	app.Get("/redirect", func(c *fiber.Ctx) error {
		queryParams := c.OriginalURL()[len(c.Path()):]
		return c.Redirect("/redirect.html" + queryParams)
	})

	app.Get("/providers", func(c *fiber.Ctx) error {
		ipAddress := c.Query("ipAddress")
		request := trinsic_api.RecommendRequest{
			RecommendationInfo: *trinsic_api.NewNullableRecommendationInfo(
				&trinsic_api.RecommendationInfo{
					IpAddresses: []string{ipAddress},
				},
			),
		}

		req := api.NetworkAPI.RecommendProviders(c.Context()).RecommendRequest(request)

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

}
