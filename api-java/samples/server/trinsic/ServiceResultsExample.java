package id.trinsic;

import id.trinsic.api.SessionsApi;
import id.trinsic.serviceresults.ExchangeResultRequest;
import id.trinsic.serviceresults.ResultExchanger;
import id.trinsic.serviceresults.ResultProcessor;
import io.javalin.Javalin;
import io.javalin.http.Context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Example routes showing how to integrate ServiceResults
 */
public class ServiceResultsExample {
    
    public static void serviceResultsExampleRoutes(Javalin app, SessionsApi session) {
        // Create a ResultExchanger instance
        ResultExchanger exchanger = new ResultExchanger(session);

        // Example route using ServiceResults with enhanced error handling
        app.post("/exchange-result-enhanced", ctx -> {
            try {
                ExchangeResultRequest request = ctx.bodyAsClass(ExchangeResultRequest.class);
                
                // Use ResultExchanger to handle the exchange with built-in validation
                Object result = exchanger.exchangeResultData(request);
                
                // Process the result for additional insights
                var processedResult = ResultProcessor.processSessionResult(result);
                
                // Return both the original result and processed insights
                Map<String, Object> response = new HashMap<>();
                response.put("result", result);
                response.put("insights", processedResult);
                
                ctx.json(response);
            } catch (ResultProcessor.ValidationException ex) {
                ctx.status(400).json(Map.of("error", ex.getMessage()));
            } catch (Exception ex) {
                System.err.println("Failed to exchange result: " + ex.getMessage());
                ctx.status(500).json(Map.of("error", "Internal server error"));
            }
        });

        // Example route for batch processing multiple results
        app.post("/exchange-multiple-results", ctx -> {
            try {
                ExchangeResultRequest[] requests = ctx.bodyAsClass(ExchangeResultRequest[].class);
                
                if (requests == null || requests.length == 0) {
                    ctx.status(400).json(Map.of("error", "Request array is required and cannot be empty"));
                    return;
                }

                List<Object> results = new ArrayList<>();
                List<String> errors = new ArrayList<>();

                for (ExchangeResultRequest request : requests) {
                    try {
                        Object result = exchanger.exchangeResultData(request);
                        results.add(result);
                        errors.add(null);
                    } catch (Exception ex) {
                        results.add(null);
                        errors.add(ex.getMessage());
                    }
                }

                Map<String, Object> response = new HashMap<>();
                response.put("results", results);
                response.put("errors", errors);
                
                ctx.json(response);
            } catch (Exception ex) {
                System.err.println("Failed to exchange multiple results: " + ex.getMessage());
                ctx.status(500).json(Map.of("error", "Internal server error"));
            }
        });

        // Example route showing result validation without exchange
        app.post("/validate-result-request", ctx -> {
            try {
                ExchangeResultRequest request = ctx.bodyAsClass(ExchangeResultRequest.class);
                
                if (request == null) {
                    ctx.status(400).json(Map.of("error", "Request body is required"));
                    return;
                }

                // Just validate the request without exchanging
                ResultProcessor.validateRequest(request);
                
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("message", "Request is valid");
                
                ctx.json(response);
            } catch (ResultProcessor.ValidationException ex) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("error", ex.getMessage());
                
                ctx.status(400).json(response);
            } catch (Exception ex) {
                System.err.println("Failed to validate request: " + ex.getMessage());
                ctx.status(500).json(Map.of("error", "Internal server error"));
            }
        });

        // Example route showing async processing
        app.post("/exchange-result-async", ctx -> {
            try {
                ExchangeResultRequest request = ctx.bodyAsClass(ExchangeResultRequest.class);
                
                // Use async exchange
                exchanger.exchangeResultDataAsync(request)
                    .thenAccept(result -> {
                        // Process the result for additional insights
                        var processedResult = ResultProcessor.processSessionResult(result);
                        
                        Map<String, Object> response = new HashMap<>();
                        response.put("result", result);
                        response.put("insights", processedResult);
                        
                        ctx.json(response);
                    })
                    .exceptionally(throwable -> {
                        if (throwable.getCause() instanceof ResultProcessor.ValidationException) {
                            ctx.status(400).json(Map.of("error", throwable.getCause().getMessage()));
                        } else {
                            System.err.println("Failed to exchange result async: " + throwable.getMessage());
                            ctx.status(500).json(Map.of("error", "Internal server error"));
                        }
                        return null;
                    });
            } catch (Exception ex) {
                System.err.println("Failed to process async exchange request: " + ex.getMessage());
                ctx.status(500).json(Map.of("error", "Internal server error"));
            }
        });
    }
}