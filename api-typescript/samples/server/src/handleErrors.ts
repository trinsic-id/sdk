import { Express, Request, Response, NextFunction } from "express";
import { ReadableStream } from "stream/web";

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});

export function handleErrors(app: Express) {
    // Helper to read Node.js readable stream
    async function streamToString(stream: ReadableStream): Promise<string> {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks).toString('utf-8');
    }

    app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
        const status = err.status || err.statusCode || err?.response?.status || 500;
        const message = err.message || 'Internal Server Error';
        let errorBody: string | undefined;
        let statusCode: string | undefined;

        // Try to extract body if SDK includes a response stream
        if (err?.response?.body instanceof ReadableStream) {
            try {
                errorBody = await streamToString(err.response.body);
            } catch (streamErr) {
                console.warn('Could not read response body:', streamErr);
            }
        } else if (typeof err?.response?.text === 'function') {
            try {
                errorBody = await err.response.text();
            } catch (textErr) {
                console.warn('Could not read response.text():', textErr);
            }
        }

        if (err?.response?.status) {
            statusCode = err.response.status + " " + err.response.statusText;
        }

        // Log for debugging
        console.error('🚨 Error middleware hit');
        console.error('Message:', message);
        console.error('Response', statusCode)
        if (errorBody) console.error('Error body:', errorBody);
        console.error(err.stack);

        // Send structured error
        res.status(status).json({
            error: {
                message,
                ...(errorBody && { body: errorBody }),
                ...(statusCode && { status: statusCode }),
            }
        });
    });
}


