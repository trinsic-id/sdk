<?php

require __DIR__ . '/../vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Server\MiddlewareInterface as MiddlewareInterface;

use Trinsic\Api\Api\NetworkApi as NetworkApi;
use Trinsic\Api\Api\SessionsApi as SessionsApi;
use Trinsic\Api\Configuration as Configuration;

use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

# This is a hack to suppress a warning that are thrown by the SDK, e.g. auto generated nullability warnings
error_reporting(E_ALL & ~E_DEPRECATED);

class JsonBodyParserMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        $contentType = $request->getHeaderLine('Content-Type');

        if (strstr($contentType, 'application/json')) {
            $contents = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $request = $request->withParsedBody($contents);
            }
        }

        return $handler->handle($request);
    }
}

$staticDir = realpath(__DIR__ . '/../../../../ui-web/samples/dist');

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$filePath = $staticDir . $requestUri;

// Serve static files if they exist - hacking around the fact we're serving these from our ui-web sdk folder
if (file_exists($filePath) && is_file($filePath)) {
    $mimeTypes = [
        'css' => 'text/css',
        'js'  => 'application/javascript',
        'html' => 'text/html',
        '' => 'text/html'
    ];
    
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    $mime = $mimeTypes[$ext] ?? 'application/octet-stream';
    
    header("Content-Type: $mime");
    readfile($filePath);
    exit;
}

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$authToken = getenv('TRINSIC_AUTH_TOKEN');

$app = AppFactory::create();

$app->add(function (Request $request, RequestHandler $handler) {
    return $handler->handle($request);
});

$app->add(new JsonBodyParserMiddleware());

$config = new Configuration();
$config->setAccessToken($_ENV['TRINSIC_ACCESS_TOKEN']);

$network = new NetworkApi(null, $config);
$sessions = new SessionsApi(null, $config);

$sharedRoutes = require '../src/shared.php';
$sharedRoutes($app, $network, $sessions);

$widgetRoutes = require '../src/widget.php';
$widgetRoutes($app, $sessions);

$hostedRoutes = require '../src/hosted.php';
$hostedRoutes($app, $sessions);

$advancedRoutes = require '../src/advanced.php';
$advancedRoutes($app, $sessions);

$app->run();
