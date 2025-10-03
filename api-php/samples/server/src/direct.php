<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Trinsic\Api\Model\CreateDirectProviderSessionRequest as CreateDirectProviderSessionRequest;
use Trinsic\Api\Model\CreateDirectProviderSessionResponse as CreateDirectProviderSessionResponse;
use Trinsic\Api\Model\GetSessionResultRequest as GetSessionResultRequest;
use Trinsic\Api\Model\RefreshStepContentRequest as RefreshStepContentRequest;
use Trinsic\Api\ApiException as ApiException;

return function ($app, $sessions) {

    $app->post("/create-direct-session/{provider}", function (Request $request, Response $response, $args) use ($sessions) {
        $provider = $args['provider'];
        $queryParams = $request->getQueryParams();
        $redirectUrl = $queryParams['redirectUrl'] ?? null;
        $fallbackToTrinsicUI = ($queryParams['fallbackToTrinsicUI'] ?? 'false') === 'true';
        $capabilities = isset($queryParams['capabilities']) ? explode(",", $queryParams['capabilities']) : [];

        $req = new CreateDirectProviderSessionRequest();
        $req->setRedirectUrl($redirectUrl);
        $req->setProvider($provider);
        $verificationProfileId = getenv('TRINSIC_VERIFICATION_PROFILE_ID');
        $req->setVerificationProfileId($verificationProfileId);
        $req->setCapabilities($capabilities);
        $req->setFallbackToHostedUi($fallbackToTrinsicUI);

        $result = $sessions->createDirectProviderSession($req);

        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
        
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