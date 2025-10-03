<?php
declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

class StaticFileMiddleware implements MiddlewareInterface
{
    private string $staticDir;

    public function __construct(string $staticDir)
    {
        $this->staticDir = rtrim($staticDir, DIRECTORY_SEPARATOR);
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $path = $request->getUri()->getPath();
        if ($path === '/') {
            $path = '/index.html';
        }

        $filePath = realpath($this->staticDir . $path);

        if ($filePath !== false && str_starts_with($filePath, realpath($this->staticDir)) && is_file($filePath)) {
            $response = new Response();
            $mimeType = $this->getMimeType($filePath);
            $response = $response
                ->withHeader('Content-Type', $mimeType)
                ->withStatus(200);

            $stream = fopen($filePath, 'rb');
            $response->getBody()->write(stream_get_contents($stream));
            fclose($stream);

            return $response;
        }
        $filePath = realpath($this->staticDir . $path . '.html');
        error_log('[StaticFileMiddleware] Path: ' . $filePath);
        if ($filePath !== false && str_starts_with($filePath, realpath($this->staticDir)) && is_file($filePath)) {
            $response = new Response();
            $mimeType = $this->getMimeType($filePath);
            $response = $response
                ->withHeader('Content-Type', $mimeType)
                ->withStatus(200);

            $stream = fopen($filePath, 'rb');
            $response->getBody()->write(stream_get_contents($stream));
            fclose($stream);

            return $response;
        }

        // Fallback to default Slim handler
        return $handler->handle($request);
    }

    private function getMimeType(string $filePath): string
    {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        return match ($ext) {
            'html' => 'text/html',
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'svg' => 'image/svg+xml',
            default => 'application/octet-stream',
        };
    }
}