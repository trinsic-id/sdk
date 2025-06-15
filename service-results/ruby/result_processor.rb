# frozen_string_literal: true

require 'time'
require_relative 'exchange_result_request'

module Trinsic
  module ServiceResults
    # Represents processed session result information
    class ProcessedResult
      attr_accessor :session_id, :state, :fail_code, :fail_reason, :result_count,
                    :has_verifications, :completed_at, :processed_at

      # Initialize a new ProcessedResult
      def initialize
        @session_id = nil
        @state = nil
        @fail_code = nil
        @fail_reason = nil
        @result_count = 0
        @has_verifications = false
        @completed_at = nil
        @processed_at = Time.now
      end

      # Convert to hash
      #
      # @return [Hash] Hash representation
      def to_h
        {
          sessionId: session_id,
          state: state,
          failCode: fail_code,
          failReason: fail_reason,
          resultCount: result_count,
          hasVerifications: has_verifications,
          completedAt: completed_at&.iso8601,
          processedAt: processed_at&.iso8601
        }
      end

      # Convert to JSON
      #
      # @return [String] JSON representation
      def to_json(*args)
        to_h.to_json(*args)
      end
    end

    # Utility class for processing and validating session results
    class ResultProcessor
      # Validates an ExchangeResultRequest
      #
      # @param request [ExchangeResultRequest] The request to validate
      # @raise [ValidationError] if request is nil or validation fails
      def self.validate_request(request)
        raise ValidationError, 'request cannot be nil' if request.nil?

        request.validate!
      end

      # Validates multiple requests
      #
      # @param requests [Array<ExchangeResultRequest>] Array of requests to validate
      # @return [Hash] Hash with :valid and :invalid arrays
      def self.validate_multiple_requests(requests)
        valid = []
        invalid = []

        requests.each_with_index do |request, index|
          begin
            validate_request(request)
            valid << request
          rescue ValidationError => e
            invalid << {
              index: index,
              request: request,
              error: e.message
            }
          end
        end

        {
          valid: valid,
          invalid: invalid
        }
      end

      # Processes a session result and extracts common information
      #
      # @param result [Object] The session result to process
      # @return [ProcessedResult] Processed result information
      # @raise [ArgumentError] if result is nil
      def self.process_session_result(result)
        raise ArgumentError, 'result cannot be nil' if result.nil?

        processed = ProcessedResult.new

        # Extract fields from result (adjust based on actual API response structure)
        if result.is_a?(Hash)
          session = result[:session] || result['session'] || result

          if session.is_a?(Hash)
            processed.session_id = session[:id] || session['id'] || session[:sessionId] || session['sessionId']
            processed.state = session[:state] || session['state']
            processed.fail_code = session[:failCode] || session['failCode']
            processed.fail_reason = session[:failReason] || session['failReason']

            results_data = session[:result] || session['result'] || []
            if results_data.respond_to?(:length)
              processed.result_count = results_data.length
              processed.has_verifications = results_data.length > 0
            end

            # Parse completed_at timestamp
            updated_at = session[:updatedAt] || session['updatedAt']
            if updated_at
              processed.completed_at = parse_timestamp(updated_at)
            end
          end
        elsif result.respond_to?(:session)
          session = result.session

          processed.session_id = session.respond_to?(:id) ? session.id : nil
          processed.state = session.respond_to?(:state) ? session.state : nil
          processed.fail_code = session.respond_to?(:fail_code) ? session.fail_code : nil
          processed.fail_reason = session.respond_to?(:fail_reason) ? session.fail_reason : nil

          if session.respond_to?(:result) && session.result.respond_to?(:length)
            processed.result_count = session.result.length
            processed.has_verifications = session.result.length > 0
          end

          if session.respond_to?(:updated_at) && session.updated_at.is_a?(Time)
            processed.completed_at = session.updated_at
          end
        end

        processed
      end

      # Sanitizes a request for logging (removes sensitive data)
      #
      # @param request [ExchangeResultRequest] The request to sanitize
      # @return [Hash] Hash with sensitive data redacted
      def self.sanitize_request_for_logging(request)
        return {} if request.nil?

        request.sanitize_for_logging
      end

      # Sanitizes multiple requests for logging
      #
      # @param requests [Array<ExchangeResultRequest>] Array of requests to sanitize
      # @return [Array<Hash>] Array of sanitized request hashes
      def self.sanitize_multiple_requests_for_logging(requests)
        requests.map { |request| sanitize_request_for_logging(request) }
      end

      # Extracts session IDs from a list of requests
      #
      # @param requests [Array<ExchangeResultRequest>] Array of requests
      # @return [Array<String>] Array of session IDs
      def self.extract_session_ids(requests)
        requests.filter_map { |request| request&.session_id }
      end

      # Groups requests by session ID
      #
      # @param requests [Array<ExchangeResultRequest>] Array of requests to group
      # @return [Hash] Hash mapping session IDs to arrays of requests
      def self.group_by_session_id(requests)
        requests.group_by { |request| request&.session_id }.compact
      end

      # Checks if a string is a valid UUID
      #
      # @param uuid [String] The string to check
      # @return [Boolean] true if valid UUID, false otherwise
      def self.valid_uuid?(uuid)
        return false if uuid.nil? || !uuid.is_a?(String)

        uuid_regex = /\A[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\z/i
        !uuid_regex.match(uuid).nil?
      end

      private_class_method def self.parse_timestamp(timestamp)
        return nil unless timestamp

        case timestamp
        when String
          Time.parse(timestamp)
        when Time
          timestamp
        else
          nil
        end
      rescue ArgumentError
        nil
      end
    end
  end
end