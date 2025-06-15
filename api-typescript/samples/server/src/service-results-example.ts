import { NetworkApi, SessionsApi } from "@trinsic/api";
import { Express } from "express";
import { ResultExchanger, ResultProcessor, ValidationError } from "./service-results";

/**
 * Example routes showing how to integrate ServiceResults
 */
export function serviceResultsExampleRoutes(app: Express, networkApi: NetworkApi, sessionsApi: SessionsApi) {
  // Create a ResultExchanger instance
  const exchanger = new ResultExchanger(sessionsApi);

  // Example route using ServiceResults with enhanced error handling
  app.post("/exchange-result-enhanced", async (req: any, res: any) => {
    try {
      const request = req.body;
      
      if (!request) {
        return res.status(400).json({ error: "Request body is required" });
      }

      // Use ResultExchanger to handle the exchange with built-in validation
      const result = await exchanger.exchangeResultData(request);
      
      // Process the result for additional insights
      const processedResult = ResultProcessor.processSessionResult(result);
      
      // Return both the original result and processed insights
      res.json({
        result: result,
        insights: processedResult
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("Failed to exchange result:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Example route for batch processing multiple results
  app.post("/exchange-multiple-results", async (req: any, res: any) => {
    try {
      const requests = req.body;
      
      if (!Array.isArray(requests) || requests.length === 0) {
        return res.status(400).json({ error: "Request array is required and cannot be empty" });
      }

      const results = await exchanger.exchangeMultipleResultsSettled(requests);
      
      const processedResults = results.map(result => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return null;
        }
      });

      const errors = results.map(result => {
        if (result.status === 'rejected') {
          return result.reason.message || result.reason;
        } else {
          return null;
        }
      });

      res.json({
        results: processedResults,
        errors: errors
      });
    } catch (error) {
      console.error("Failed to exchange multiple results:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Example route showing result validation without exchange
  app.post("/validate-result-request", async (req: any, res: any) => {
    try {
      const request = req.body;
      
      if (!request) {
        return res.status(400).json({ error: "Request body is required" });
      }

      // Just validate the request without exchanging
      ResultProcessor.validateRequest(request);
      
      res.json({
        valid: true,
        message: "Request is valid"
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          valid: false,
          error: error.message
        });
      } else {
        console.error("Failed to validate request:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Example route showing batch validation
  app.post("/validate-multiple-requests", async (req: any, res: any) => {
    try {
      const requests = req.body;
      
      if (!Array.isArray(requests)) {
        return res.status(400).json({ error: "Request array is required" });
      }

      const { valid, invalid } = ResultProcessor.validateMultipleRequests(requests);
      
      res.json({
        validCount: valid.length,
        invalidCount: invalid.length,
        valid: valid.map(r => ResultProcessor.sanitizeForLogging(r)),
        invalid: invalid
      });
    } catch (error) {
      console.error("Failed to validate multiple requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}