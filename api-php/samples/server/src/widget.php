<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Trinsic\Api\Model\CreateWidgetSessionRequest as CreateWidgetSessionRequest;
use Trinsic\Api\Model\CreateWidgetSessionResponse as CreateWidgetSessionResponse;

return function ($app, $sessions) {

    $app->post("/create-widget-session", function (Request $request, Response $response, $args) use ($sessions) {
        $redirectUrl = $request->getQueryParams()['redirectUrl'] ?? null;
        $req = new CreateWidgetSessionRequest();
        $req->setRedirectUrl($redirectUrl);
        $verificationProfileId = getenv('TRINSIC_VERIFICATION_PROFILE_ID');
        $req->setVerificationProfileId($verificationProfileId);
        $result = $sessions->createWidgetSession($req);
    
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });

};