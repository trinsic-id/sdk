package main

import (
	"fmt"
	"io"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v2"
)

func AdvancedRoutes(app *fiber.App, api *trinsic_api.APIClient) {
	app.Get("/advanced", func(c *fiber.Ctx) error {
		return c.Redirect("/advanced.html")
	})

	app.Get("/advanced-popup", func(c *fiber.Ctx) error {
		queryParams := c.OriginalURL()[len(c.Path()):]
		return c.Redirect("/advanced-popup.html" + queryParams)
	})

	app.Get("/advanced-launch/:provider", func(c *fiber.Ctx) error {
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
		req := trinsic_api.CreateAdvancedProviderSessionRequest{
			RedirectUrl:        *trinsic_api.NewNullableString(&redirectUrl),
			Provider:           provider,
			Capabilities:       integrationCapabilities,
			FallbackToHostedUI: *trinsic_api.NewNullableBool(&fallbackToTrinsicUI),
		}

		// Call API
		opts := api.SessionsAPI.CreateAdvancedProviderSession(c.Context()).
			CreateAdvancedProviderSessionRequest(req)

		result, response, err := opts.Execute()
		if err != nil {
			bodyBytes, err := io.ReadAll(response.Body)
			if err != nil {
				panic(err)
			}

			bodyString := string(bodyBytes)
			errorContent := url.QueryEscape(bodyString)
			return c.Redirect("/advanced-popup?error=" + errorContent)
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

		return c.Redirect("/advanced-popup?" + queryParams.Encode())
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
			ResultsAccessKey: *trinsic_api.NewNullableString(&requestPayload.ResultsAccessKey),
		}

		req := api.SessionsAPI.RefreshStepContent(c.Context(), sessionId).RefreshStepContentRequest(request)
		data, _, err := req.Execute()

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
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
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(data)
	})
}
