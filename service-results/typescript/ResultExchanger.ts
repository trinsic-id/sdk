import { SessionsApi } from '@trinsic/api';
import { ExchangeResultRequest } from './ExchangeResultRequest';
import { ResultProcessor, ValidationError } from './ResultProcessor';

/**
 * Service for exchanging result access keys and retrieving session results
 */
export class ResultExchanger {
  private readonly sessionsApi: SessionsApi;

  /**
   * Constructor
   * @param sessionsApi The Trinsic sessions API instance
   */
  constructor(sessionsApi: SessionsApi) {
    if (!sessionsApi) {
      throw new Error('sessionsApi cannot be null or undefined');
    }
    this.sessionsApi = sessionsApi;
  }

  /**
   * Exchange a result access key for the actual session results
   * @param request The exchange request containing session ID and access key
   * @returns Promise containing the session result
   * @throws ValidationError if request validation fails
   * @throws Error if API call fails
   */
  async exchangeResult(request: ExchangeResultRequest): Promise<any> {
    if (!request) {
      throw new Error('request cannot be null or undefined');
    }

    // Validate the request
    ResultProcessor.validateRequest(request);

    try {
      // Call the API
      const result = await this.sessionsApi.getSessionResult(request.sessionId, {
        resultsAccessKey: request.resultsAccessKey,
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to exchange result: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Exchange a result access key and return the unwrapped result data
   * @param request The exchange request
   * @returns Promise containing the unwrapped session result data
   */
  async exchangeResultData(request: ExchangeResultRequest): Promise<any> {
    const response = await this.exchangeResult(request);
    // In practice, you would extract the data portion from the response
    // This depends on the specific structure of the API response
    return response;
  }

  /**
   * Exchange multiple results concurrently
   * @param requests Array of exchange requests
   * @returns Promise containing array of session results
   */
  async exchangeMultipleResults(requests: ExchangeResultRequest[]): Promise<any[]> {
    if (!Array.isArray(requests)) {
      throw new Error('requests must be an array');
    }

    const exchangePromises = requests.map(request => this.exchangeResult(request));
    return Promise.all(exchangePromises);
  }

  /**
   * Exchange multiple results with individual error handling
   * @param requests Array of exchange requests
   * @returns Promise containing array of results or errors
   */
  async exchangeMultipleResultsSettled(requests: ExchangeResultRequest[]): Promise<PromiseSettledResult<any>[]> {
    if (!Array.isArray(requests)) {
      throw new Error('requests must be an array');
    }

    const exchangePromises = requests.map(request => this.exchangeResult(request));
    return Promise.allSettled(exchangePromises);
  }
}