<?php

require __DIR__ . '/../vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Server\MiddlewareInterface as MiddlewareInterface;

use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

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

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$authToken = getenv('TRINSIC_AUTH_TOKEN');

$app = AppFactory::create();

$app->add(function (Request $request, RequestHandler $handler) {
    return $handler->handle($request);
});

$app->add(new JsonBodyParserMiddleware());

require __DIR__ . '/../src/routes.php';

$app->run();
