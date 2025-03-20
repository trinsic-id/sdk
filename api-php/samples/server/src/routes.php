<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use Trinsic\Api\Api\NetworkApi as NetworkApi;
use Trinsic\Api\Api\SessionsApi as SessionsApi;
use Trinsic\Api\Configuration as Configuration;
use Trinsic\Api\Model\CreateSessionRequest as CreateSessionRequest;
use Trinsic\Api\Model\CreateSessionResponse as CreateSessionResponse;


$config = new Configuration();
$config->setAccessToken($_ENV['TRINSIC_ACCESS_TOKEN']);

$network = new NetworkApi(null, $config);
$sessions = new SessionsApi(null, $config);

$sharedRoutes = require 'shared.php';
$sharedRoutes($app, $network, $sessions);

$widgetRoutes = require 'widget.php';
$widgetRoutes($app, $sessions);

$hostedRoutes = require 'hosted.php';
$hostedRoutes($app, $sessions);

$app->get("/launch/{providerId}", function (Request $request, Response $response, $args) use ($sessions) {
    $providerId = $args['providerId'];
    $redirectUrl = $request->getQueryParams()['redirectUrl'];

    $launchRequest = new CreateSessionRequest([
        'launchModeDirectly' => true,
        'providers' => [$providerId]
    ]);

    $result = $sessions->createSession($launchRequest);

    if ($result instanceof CreateSessionResponse) {
        $launchUrl = $result->getLaunchUrl();
        $newLocation = $launchUrl . "&redirectUrl=" . $redirectUrl;

        return $response
            ->withHeader('Location', $newLocation)
            ->withStatus(302);
    }

    return $response->withStatus(500);
});


