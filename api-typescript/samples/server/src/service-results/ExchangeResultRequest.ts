/**
 * Standard request model for exchanging session result access keys
 */
export interface ExchangeResultRequest {
  /**
   * The unique identifier for the verification session
   */
  sessionId: string;

  /**
   * The access key needed to retrieve session results
   */
  resultsAccessKey: string;
}

/**
 * Creates an ExchangeResultRequest with validation
 */
export function createExchangeResultRequest(
  sessionId: string,
  resultsAccessKey: string
): ExchangeResultRequest {
  return {
    sessionId,
    resultsAccessKey,
  };
}

/**
 * Type guard to check if an object is a valid ExchangeResultRequest
 */
export function isExchangeResultRequest(obj: any): obj is ExchangeResultRequest {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.sessionId === 'string' &&
    typeof obj.resultsAccessKey === 'string'
  );
}