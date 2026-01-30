package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v3"
)

func SharedRoutes(app *fiber.App, api *trinsic_api.APIClient) {
	app.Static("/", "../../../ui-web/samples/dist")

	app.Get("/redirect", func(c *fiber.Ctx) error {
		queryParams := c.OriginalURL()[len(c.Path()):]
		return c.Redirect("/redirect.html" + queryParams)
	})

	app.Get("/providers", func(c *fiber.Ctx) error {
		ipAddress := c.Query("ipAddress")
		verificationProfileId := os.Getenv("TRINSIC_VERIFICATION_PROFILE_ID")
		
		var recommendationInfo trinsic_api.NullableRecommendationInfo

		if ipAddress != "" {
			recommendationInfo = *trinsic_api.NewNullableRecommendationInfo(
				&trinsic_api.RecommendationInfo{
					IpAddresses: []string{ipAddress},
				},
			)
		}

		request := trinsic_api.RecommendProvidersRequest{
			RecommendationInfo:    recommendationInfo,
			VerificationProfileId: verificationProfileId,
		}

		req := api.SessionsAPI.RecommendProviders(c.Context()).RecommendProvidersRequest(request)

		data, _, err := req.Execute()

		if err != nil {
			return err
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
			return err
		}

		return c.JSON(data)
	})

}
