<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Trinsic\Api\Model\CreateAdvancedProviderSessionRequest as CreateAdvancedProviderSessionRequest;
use Trinsic\Api\Model\CreateAdvancedProviderSessionResponse as CreateAdvancedProviderSessionResponse;
use Trinsic\Api\Model\GetSessionResultRequest as GetSessionResultRequest;
use Trinsic\Api\Model\RefreshStepContentRequest as RefreshStepContentRequest;
use Trinsic\Api\ApiException as ApiException;

return function ($app, $sessions) {
    
    // Index route to serve the index.html file
    $app->get('/advanced', function (Request $request, Response $response, $args) {
        return $response
            ->withHeader('Location', '/advanced.html')
            ->withStatus(302);
    });

    $app->get('/advanced-popup', function (Request $request, Response $response, $args) {
        $queryParams = $request->getQueryParams();
        
        $queryString = http_build_query($queryParams);
        
        $redirectUrl = '/advanced-popup.html' . (!empty($queryString) ? '?' . $queryString : '');
        return $response
            ->withHeader('Location', $redirectUrl)
            ->withStatus(302);
    });

    $app->get("/advanced-launch/{provider}", function (Request $request, Response $response, $args) use ($sessions) {
        try {
            $provider = $args['provider'];
            $queryParams = $request->getQueryParams();
            $redirectUrl = $queryParams['redirectUrl'] ?? null;
            $fallbackToTrinsicUI = ($queryParams['fallbackToTrinsicUI'] ?? 'false') === 'true';
            $capabilities = isset($queryParams['capabilities']) ? explode(",", $queryParams['capabilities']) : [];
    
            $req = new CreateAdvancedProviderSessionRequest();
            $req->setRedirectUrl($redirectUrl);
            $req->setProvider($provider);
            $req->setCapabilities($capabilities);
            $req->setFallbackToHostedUi($fallbackToTrinsicUI);
    
            $result = $sessions->createAdvancedProviderSession($req);
    
            if ($result->getNextStep()->getMethod() === 'LaunchBrowser') {
                return $response
                    ->withHeader('Location', $result->getNextStep()->getContent())
                    ->withStatus(302);
            } else {
                $shouldRefresh = !is_null($result->getNextStep()->getRefresh());
                $refreshAfter = $shouldRefresh ? $result->getNextStep()->getRefresh()->getRefreshAfter()->format(DATE_ISO8601) : gmdate(DATE_ISO8601);
    
                $queryParams = http_build_query([
                    'sessionId' => $result->getSessionId(),
                    'resultsAccessKey' => $result->getResultCollection()->getResultsAccessKey(),
                    'nextStep' => $result->getNextStep()->getMethod(),
                    'content' => $result->getNextStep()->getContent(),
                    'shouldRefresh' => $shouldRefresh ? 'true' : 'false',
                    'refreshAfter' => $refreshAfter
                ]);
    
                return $response
                    ->withHeader('Location', "/advanced-popup?$queryParams")
                    ->withStatus(302);
            }
        } catch (ApiException $e) {
            $errorContent = urlencode($e->getResponseBody());
            return $response
                ->withHeader('Location', "/advanced-popup?error=$errorContent")
                ->withStatus(302);
        }
    });
    
    $app->post("/refresh-content/{sessionId}", function (Request $request, Response $response, $args) use ($sessions) {
        $sessionId = $args['sessionId'];
        $body = json_decode($request->getBody()->getContents(), true);
        $resultsAccessKey = $body['resultsAccessKey'] ?? null;
    
        $req = new RefreshStepContentRequest();
        $req->setResultsAccessKey($resultsAccessKey);
        $result = $sessions->refreshStepContent($sessionId, $req);
    
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $app->post("/poll-results/{sessionId}", function (Request $request, Response $response, $args) use ($sessions) {
        $sessionId = $args['sessionId'];
        $body = json_decode($request->getBody()->getContents(), true);
        $resultsAccessKey = $body['resultsAccessKey'] ?? null;
    
        $req = new GetSessionResultRequest();
        $req->setResultsAccessKey($resultsAccessKey);
    
        $result = $sessions->getSessionResult($sessionId, $req);
    
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });

};