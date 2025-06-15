import { ExchangeResultRequest, isExchangeResultRequest } from './ExchangeResultRequest';

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Represents processed session result information
 */
export interface ProcessedResult {
  sessionId?: string;
  state?: string;
  failCode?: string;
  failReason?: string;
  resultCount: number;
  hasVerifications: boolean;
  completedAt?: Date;
  processedAt: Date;
}

/**
 * Utility class for processing and validating session results
 */
export class ResultProcessor {
  /**
   * Validates an ExchangeResultRequest
   * @param request The request to validate
   * @throws Error if request is null or undefined
   * @throws ValidationError if validation fails
   */
  static validateRequest(request: ExchangeResultRequest): void {
    if (!request) {
      throw new Error('request cannot be null or undefined');
    }

    // Type check
    if (!isExchangeResultRequest(request)) {
      throw new ValidationError('Invalid request structure');
    }

    // Validate sessionId
    if (!request.sessionId || request.sessionId.trim().length === 0) {
      throw new ValidationError('SessionId cannot be null or empty');
    }

    // Validate resultsAccessKey
    if (!request.resultsAccessKey || request.resultsAccessKey.trim().length === 0) {
      throw new ValidationError('ResultsAccessKey cannot be null or empty');
    }

    // Validate SessionId format (should be a valid UUID)
    if (!this.isValidUuid(request.sessionId)) {
      throw new ValidationError('SessionId must be a valid UUID');
    }

    // Validate resultsAccessKey format (basic check)
    if (request.resultsAccessKey.length < 10) {
      throw new ValidationError('ResultsAccessKey appears to be too short');
    }
  }

  /**
   * Checks if a string is a valid UUID
   * @param str The string to check
   * @returns true if valid UUID, false otherwise
   */
  private static isValidUuid(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  /**
   * Processes a session result and extracts common information
   * @param result The session result to process
   * @returns Processed result information
   */
  static processSessionResult(result: any): ProcessedResult {
    if (!result) {
      throw new Error('result cannot be null or undefined');
    }

    // Extract common fields (adjust based on actual API response structure)
    const session = result.session || result;
    
    return {
      sessionId: session.id || session.sessionId,
      state: session.state?.toString(),
      failCode: session.failCode?.toString(),
      failReason: session.failReason,
      resultCount: session.result?.length || 0,
      hasVerifications: Array.isArray(session.result) && session.result.length > 0,
      completedAt: session.updatedAt ? new Date(session.updatedAt) : undefined,
      processedAt: new Date(),
    };
  }

  /**
   * Validates multiple requests
   * @param requests Array of requests to validate
   * @returns Array of validation results
   */
  static validateMultipleRequests(requests: ExchangeResultRequest[]): { 
    valid: ExchangeResultRequest[], 
    invalid: { request: any, error: string }[] 
  } {
    const valid: ExchangeResultRequest[] = [];
    const invalid: { request: any, error: string }[] = [];

    for (const request of requests) {
      try {
        this.validateRequest(request);
        valid.push(request);
      } catch (error) {
        invalid.push({
          request,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { valid, invalid };
  }

  /**
   * Sanitizes a request for logging (removes sensitive data)
   * @param request The request to sanitize
   * @returns Sanitized request
   */
  static sanitizeForLogging(request: ExchangeResultRequest): Partial<ExchangeResultRequest> {
    return {
      sessionId: request.sessionId,
      resultsAccessKey: '[REDACTED]',
    };
  }
}