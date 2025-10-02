package main

import (
	"fmt"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v2"
)

func DirectRoutes(app *fiber.App, api *trinsic_api.APIClient) {
	app.Get("/direct", func(c *fiber.Ctx) error {
		return c.Redirect("/direct.html")
	})

	app.Get("/direct-popup", func(c *fiber.Ctx) error {
		queryParams := c.OriginalURL()[len(c.Path()):]
		return c.Redirect("/direct-popup.html" + queryParams)
	})

	app.Get("/direct-launch/:provider", func(c *fiber.Ctx) error {
		provider := c.Params("provider")
		redirectUrl := c.Query("redirectUrl")
		fallbackToTrinsicUI := c.Query("fallbackToTrinsicUI") == "true"
		capabilities := strings.Split(c.Query("capabilities"), ",")
		// Convert []string to []trinsic_api.IntegrationCapability
		var integrationCapabilities []trinsic_api.IntegrationCapability
		for _, c := range capabilities {
			integrationCapabilities = append(integrationCapabilities, trinsic_api.IntegrationCapability(c))
		}

		// Create request
		req := trinsic_api.CreateDirectProviderSessionRequest{
			RedirectUrl:        *trinsic_api.NewNullableString(&redirectUrl),
			Provider:           provider,
			Capabilities:       integrationCapabilities,
			FallbackToHostedUI: *trinsic_api.NewNullableBool(&fallbackToTrinsicUI),
		}

		// Call API
		opts := api.SessionsAPI.CreateDirectProviderSession(c.Context()).
			CreateDirectProviderSessionRequest(req)

		result, _, err := opts.Execute()
		if err != nil {
			return err
		}

		// Handle response
		if result.NextStep.Method == trinsic_api.INTEGRATIONLAUNCHMETHOD_LAUNCH_BROWSER {
			return c.Redirect(result.NextStep.Content)
		}

		refreshStep := result.NextStep.Refresh.Get()
		shouldRefresh := refreshStep != nil
		var refreshAfter string
		if shouldRefresh {
			fmt.Println(refreshStep)
			refreshAfter = result.NextStep.Refresh.Get().RefreshAfter.Format(time.RFC3339)
		} else {
			refreshAfter = time.Now().UTC().Format(time.RFC3339)
		}

		// Prepare query parameters
		queryParams := url.Values{
			"sessionId":        {result.SessionId},
			"resultsAccessKey": {result.ResultCollection.ResultsAccessKey},
			"nextStep":         {string(result.NextStep.Method)},
			"content":          {result.NextStep.Content},
			"shouldRefresh":    {strconv.FormatBool(shouldRefresh)},
			"refreshAfter":     {refreshAfter},
		}

		return c.Redirect("/direct-popup?" + queryParams.Encode())
	})

	app.Post("/refresh-content/:sessionId", func(c *fiber.Ctx) error {
		sessionId := c.Params("sessionId")

		// Parse request body
		var requestPayload struct {
			ResultsAccessKey string `json:"resultsAccessKey"`
		}
		if err := c.BodyParser(&requestPayload); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Create request
		request := trinsic_api.RefreshStepContentRequest{
			ResultsAccessKey: requestPayload.ResultsAccessKey,
		}

		req := api.SessionsAPI.RefreshStepContent(c.Context(), sessionId).RefreshStepContentRequest(request)
		data, _, err := req.Execute()

		if err != nil {
			return err
		}

		return c.JSON(data)
	})

	app.Post("/poll-results/:sessionId", func(c *fiber.Ctx) error {
		sessionId := c.Params("sessionId")

		// Parse request body
		var requestPayload struct {
			ResultsAccessKey string `json:"resultsAccessKey"`
		}
		if err := c.BodyParser(&requestPayload); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Create request
		request := trinsic_api.GetSessionResultRequest{
			ResultsAccessKey: requestPayload.ResultsAccessKey,
		}

		req := api.SessionsAPI.GetSessionResult(c.Context(), sessionId).GetSessionResultRequest(request)
		data, _, err := req.Execute()

		if err != nil {
			return err
		}

		return c.JSON(data)
	})
}
