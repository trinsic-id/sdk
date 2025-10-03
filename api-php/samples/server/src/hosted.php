<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Trinsic\Api\Model\CreateHostedProviderSessionRequest as CreateHostedProviderSessionRequest;
use Trinsic\Api\Model\CreateHostedProviderSessionResponse as CreateHostedProviderSessionResponse;

return function ($app, $sessions) {
    

    $app->post("/create-hosted-session/{provider}", function (Request $request, Response $response, $args) use ($sessions) {
        $provider = $args['provider'];
        $redirectUrl = $request->getQueryParams()['redirectUrl'];
    
        $req = new CreateHostedProviderSessionRequest();
        $verificationProfileId = getenv('TRINSIC_VERIFICATION_PROFILE_ID');
        $req->setVerificationProfileId($verificationProfileId);
        $req->setRedirectUrl($redirectUrl);
        $req->setProvider($provider);
    
        $result = $sessions->createHostedProviderSession($req);
    
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });

};