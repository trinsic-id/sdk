<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Trinsic\Api\Model\CreateWidgetSessionRequest as CreateWidgetSessionRequest;
use Trinsic\Api\Model\CreateWidgetSessionResponse as CreateWidgetSessionResponse;

return function ($app, $sessions) {
    
    // Index route to serve the index.html file
    $app->get('/widget', function (Request $request, Response $response, $args) {
        return $response
            ->withHeader('Location', '/widget.html')
            ->withStatus(302);
    });

    $app->post("/create-session", function (Request $request, Response $response, $args) use ($sessions) {
        $redirectUrl = $request->getQueryParams()['redirectUrl'];
        $createRequest = new CreateWidgetSessionRequest();
        $createRequest->setRedirectUrl($redirectUrl);
        $result = $sessions->createWidgetSession($createRequest);
    
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });

};