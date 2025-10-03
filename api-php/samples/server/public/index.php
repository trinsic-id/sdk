<?php

require __DIR__ . '/../vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Server\MiddlewareInterface as MiddlewareInterface;

use Trinsic\Api\Api\NetworkApi as NetworkApi;
use Trinsic\Api\Api\SessionsApi as SessionsApi;
use Trinsic\Api\Configuration as Configuration;
use Trinsic\Api\ApiException;
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

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
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
$dotenv->safeLoad();

// Load environment variables from .env file into same structure so it can be used by the SDK 
foreach ($_ENV as $key => $value) {
    if (getenv($key) === false) {
        putenv("$key=$value");
    }
}

$authToken = getenv('TRINSIC_ACCESS_TOKEN');

$app = AppFactory::create();

// Error handling middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$customHandler = function (
    $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails
) use ($app): Response {
    $response = $app->getResponseFactory()->createResponse();

    $statusCode = $exception instanceof ApiException
        ? ($exception->getCode() ?: 500)
        : 500;

    $message = $exception instanceof ApiException
        ? "Trinsic API error: {$exception->getMessage()}"
        : "Unexpected error: {$exception->getMessage()}";

    error_log($message);

    if (method_exists($exception, 'getResponseBody')) {
        $message = "Trinsic APIException: {$exception->getCode()} - {$exception->getResponseBody()}";
        error_log("Response body: " . json_encode($exception->getResponseBody()));
    }

    $response->getBody()->write(json_encode([
        'message' => 'Request failed: check logs for details.',
        'error' => $message,
    ]));

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($statusCode);
};

// Attach custom handler as the default
$errorMiddleware->setDefaultErrorHandler($customHandler);

$app->add(function (Request $request, RequestHandler $handler) {
    return $handler->handle($request);
});

$app->add(new JsonBodyParserMiddleware());

$config = new Configuration();
$config->setAccessToken($authToken);

$network = new NetworkApi(null, $config);
$sessions = new SessionsApi(null, $config);

require_once __DIR__ . '/../src/static-file-middleware.php';
// Absolute path to your static files
$staticDir = realpath(__DIR__ . '/../../../../ui-web/samples/dist');

// Register the middleware
$app->add(new \App\Middleware\StaticFileMiddleware($staticDir));

$sharedRoutes = require __DIR__ . '/../src/shared.php';
$sharedRoutes($app, $network, $sessions);

$widgetRoutes = require  __DIR__ . '/../src/widget.php';
$widgetRoutes($app, $sessions);

$hostedRoutes = require  __DIR__ . '/../src/hosted.php';
$hostedRoutes($app, $sessions);

$directRoutes = require  __DIR__ . '/../src/direct.php';
$directRoutes($app, $sessions);


$app->run();
