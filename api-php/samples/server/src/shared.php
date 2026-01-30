<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Trinsic\Api\Model\GetSessionResultRequest as GetSessionResultRequest;
use Trinsic\Api\Model\RecommendProvidersRequest as RecommendProvidersRequest;
use Trinsic\Api\Model\RecommendationInfo as RecommendationInfo;
use Trinsic\Api\Model\RecommendProvidersResponse as RecommendProvidersResponse;

return function ($app, $sessions) {
    

    $app->get('/redirect', function (Request $request, Response $response, $args) {
        $queryParams = $request->getQueryParams();
        
        $queryString = http_build_query($queryParams);
        
        $redirectUrl = '/redirect.html' . (!empty($queryString) ? '?' . $queryString : '');
        return $response
            ->withHeader('Location', $redirectUrl)
            ->withStatus(302);
    });

    $app->get("/providers", function (Request $request, Response $response, $args) use ($sessions) {
        $ipAddress = $request->getQueryParams()['ipAddress'] ?? null;

        $req = new RecommendProvidersRequest();
        $verificationProfileId = getenv('TRINSIC_VERIFICATION_PROFILE_ID');
        $req->setVerificationProfileId($verificationProfileId);

        if ($ipAddress) {
            $reqInfo = new RecommendationInfo();
            $reqInfo->setIpAddresses([$ipAddress]);
            $req->setRecommendationInfo($reqInfo);
        }

        $result = $sessions->recommendProviders($req);
    
        $response->getBody()->write(json_encode($result->jsonSerialize()));
        return $response->withHeader('Content-Type', 'application/json');
    });


    $app->post("/exchange-result", function (Request $request, Response $response, $args) use ($sessions) {
        $body = $request->getParsedBody();

        $exchangeRequest = new GetSessionResultRequest();
        $exchangeRequest->setResultsAccessKey($body['resultsAccessKey']);

        $result = $sessions->getSessionResult($body['sessionId'], $exchangeRequest);

        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });


};