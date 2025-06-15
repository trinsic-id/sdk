# frozen_string_literal: true

require_relative 'exchange_result_request'

module Trinsic
  module ServiceResults
    # Abstract interface for the Trinsic sessions API
    class SessionsApiInterface
      # Gets session result from the API
      #
      # @param session_id [String] The session identifier
      # @param request [Hash] The API request parameters
      # @return [Object] The session result
      # @raise [NotImplementedError] This method must be implemented by subclasses
      def get_session_result(session_id, request)
        raise NotImplementedError, 'Subclasses must implement get_session_result'
      end
    end

    # Service for exchanging result access keys and retrieving session results
    class ResultExchanger
      # Initialize the ResultExchanger
      #
      # @param sessions_api [SessionsApiInterface] The Trinsic sessions API instance
      # @raise [ArgumentError] if sessions_api is nil
      def initialize(sessions_api)
        raise ArgumentError, 'sessions_api cannot be nil' if sessions_api.nil?

        @sessions_api = sessions_api
      end

      # Exchange a result access key for the actual session results
      #
      # @param request [ExchangeResultRequest] The exchange request
      # @return [Object] The session result
      # @raise [ArgumentError] if request is nil
      # @raise [ValidationError] if request validation fails
      # @raise [StandardError] if API call fails
      def exchange_result(request)
        raise ArgumentError, 'request cannot be nil' if request.nil?

        # Validation is already done in the request constructor
        request.validate!

        api_request = {
          resultsAccessKey: request.results_access_key
        }

        @sessions_api.get_session_result(request.session_id, api_request)
      rescue => e
        raise StandardError, "Failed to exchange result: #{e.message}"
      end

      # Exchange multiple result access keys
      #
      # @param requests [Array<ExchangeResultRequest>] Array of exchange requests
      # @return [Hash] Hash with :results and :errors arrays
      def exchange_multiple_results(requests)
        raise ArgumentError, 'requests must be an Array' unless requests.is_a?(Array)

        results = []
        errors = []

        requests.each do |request|
          begin
            result = exchange_result(request)
            results << result
            errors << nil
          rescue => e
            results << nil
            errors << e.message
          end
        end

        {
          results: results,
          errors: errors
        }
      end

      # Exchange result with retry logic
      #
      # @param request [ExchangeResultRequest] The exchange request
      # @param max_retries [Integer] Maximum number of retry attempts
      # @param retry_delay [Float] Delay between retries in seconds
      # @return [Object] The session result
      # @raise [ValidationError] if request validation fails (no retry)
      # @raise [StandardError] if all retry attempts fail
      def exchange_result_with_retry(request, max_retries: 3, retry_delay: 1.0)
        last_exception = nil

        (max_retries + 1).times do |attempt|
          begin
            return exchange_result(request)
          rescue ValidationError => e
            # Don't retry validation errors
            raise e
          rescue => e
            last_exception = e

            if attempt < max_retries
              sleep(retry_delay)
            end
          end
        end

        raise StandardError, "Failed to exchange result after #{max_retries + 1} attempts: #{last_exception.message}"
      end

      # Exchange results concurrently using threads
      #
      # @param requests [Array<ExchangeResultRequest>] Array of exchange requests
      # @param max_threads [Integer] Maximum number of threads to use
      # @return [Hash] Hash with :results and :errors arrays
      def exchange_multiple_results_concurrent(requests, max_threads: 5)
        raise ArgumentError, 'requests must be an Array' unless requests.is_a?(Array)

        results = Array.new(requests.length)
        errors = Array.new(requests.length)

        threads = []
        queue = Queue.new

        # Add all requests to the queue with their indices
        requests.each_with_index { |request, index| queue << [request, index] }

        # Create worker threads
        max_threads.times do
          threads << Thread.new do
            while (request_data = queue.pop(true) rescue nil)
              request, index = request_data

              begin
                result = exchange_result(request)
                results[index] = result
                errors[index] = nil
              rescue => e
                results[index] = nil
                errors[index] = e.message
              end
            end
          end
        end

        # Wait for all threads to complete
        threads.each(&:join)

        {
          results: results,
          errors: errors
        }
      end
    end
  end
end