<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use Trinsic\Api\Api\NetworkApi as NetworkApi;
use Trinsic\Api\Api\SessionsApi as SessionsApi;
use Trinsic\Api\Configuration as Configuration;
use Trinsic\Api\Model\CreateSessionRequest as CreateSessionRequest;
use Trinsic\Api\Model\CreateSessionResponse as CreateSessionResponse;
use Trinsic\Api\Model\GetSessionResultRequest as GetSessionResultRequest;

$config = new Configuration();
$config->setAccessToken($_ENV['TRINSIC_AUTH_TOKEN']);

$network = new NetworkApi(null, $config);
$sessions = new SessionsApi(null, $config);

$app->get("/providers", function (Request $request, Response $response, $args) use ($network) {
    $result = $network->listProviders();
    $response->getBody()->write(json_encode($result));
    return $response->withHeader('Content-Type', 'application/json');
});

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

$app->post("/create-session", function (Request $request, Response $response, $args) use ($sessions) {
    $createRequest = new CreateSessionRequest();
    $result = $sessions->createSession($createRequest);

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

// Index route to serve the index.html file
$app->get('/', function (Request $request, Response $response, $args) {
    return $response
        ->withHeader('Location', '/index.html')
        ->withStatus(302);
});

$app->get('/redirect', function (Request $request, Response $response, $args) {
    return $response
        ->withHeader('Location', '/redirect.html')
        ->withStatus(302);
});
