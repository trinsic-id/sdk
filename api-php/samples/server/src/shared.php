<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Trinsic\Api\Model\GetSessionResultRequest as GetSessionResultRequest;

return function ($app, $network, $sessions) {
    
    // Index route to serve the index.html file
    $app->get('/', function (Request $request, Response $response, $args) {
        return $response
            ->withHeader('Location', '/index.html')
            ->withStatus(302);
    });

    $app->get('/redirect', function (Request $request, Response $response, $args) {
        $queryParams = $request->getQueryParams();
        
        $queryString = http_build_query($queryParams);
        
        $redirectUrl = '/redirect.html' . (!empty($queryString) ? '?' . $queryString : '');
        return $response
            ->withHeader('Location', $redirectUrl)
            ->withStatus(302);
    });

    $app->get("/providers", function (Request $request, Response $response, $args) use ($network) {
        $result = $network->listProviders();
        $response->getBody()->write(json_encode($result));
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