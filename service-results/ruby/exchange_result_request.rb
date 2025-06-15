# frozen_string_literal: true

require 'securerandom'

module Trinsic
  module ServiceResults
    # Standard request model for exchanging session result access keys
    class ExchangeResultRequest
      attr_accessor :session_id, :results_access_key

      # Initialize a new ExchangeResultRequest
      #
      # @param session_id [String] The unique identifier for the verification session
      # @param results_access_key [String] The access key needed to retrieve session results
      def initialize(session_id, results_access_key)
        @session_id = session_id
        @results_access_key = results_access_key
        validate!
      end

      # Validates the request
      #
      # @raise [ValidationError] if validation fails
      def validate!
        raise ValidationError, 'session_id cannot be nil or empty' if session_id.nil? || session_id.strip.empty?
        raise ValidationError, 'results_access_key cannot be nil or empty' if results_access_key.nil? || results_access_key.strip.empty?
        raise ValidationError, 'session_id must be a valid UUID' unless valid_uuid?(session_id)
        raise ValidationError, 'results_access_key appears to be too short' if results_access_key.length < 10
      end

      # Checks if the request is valid
      #
      # @return [Boolean] true if valid, false otherwise
      def valid?
        validate!
        true
      rescue ValidationError
        false
      end

      # Converts the request to a hash
      #
      # @return [Hash] Hash representation of the request
      def to_h
        {
          sessionId: session_id,
          resultsAccessKey: results_access_key
        }
      end

      # Converts the request to JSON
      #
      # @return [String] JSON representation of the request
      def to_json(*args)
        to_h.to_json(*args)
      end

      # Creates an ExchangeResultRequest from a hash
      #
      # @param data [Hash] Hash containing the request data
      # @return [ExchangeResultRequest] New instance
      # @raise [ArgumentError] if required fields are missing
      def self.from_hash(data)
        session_id = data[:sessionId] || data['sessionId']
        results_access_key = data[:resultsAccessKey] || data['resultsAccessKey']

        raise ArgumentError, 'sessionId is required' if session_id.nil?
        raise ArgumentError, 'resultsAccessKey is required' if results_access_key.nil?

        new(session_id, results_access_key)
      end

      # Creates an ExchangeResultRequest from JSON
      #
      # @param json [String] JSON string containing the request data
      # @return [ExchangeResultRequest] New instance
      def self.from_json(json)
        require 'json'
        data = JSON.parse(json, symbolize_names: true)
        from_hash(data)
      end

      # Returns a sanitized version for logging
      #
      # @return [Hash] Hash with sensitive data redacted
      def sanitize_for_logging
        {
          sessionId: session_id,
          resultsAccessKey: '[REDACTED]'
        }
      end

      # String representation with redacted access key
      #
      # @return [String] String representation
      def to_s
        "#<ExchangeResultRequest session_id=#{session_id} results_access_key=[REDACTED]>"
      end

      # Detailed inspection
      #
      # @return [String] Detailed string representation
      def inspect
        to_s
      end

      private

      # Checks if a string is a valid UUID
      #
      # @param uuid [String] The string to check
      # @return [Boolean] true if valid UUID, false otherwise
      def valid_uuid?(uuid)
        uuid_regex = /\A[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\z/i
        !uuid_regex.match(uuid).nil?
      end
    end

    # Custom validation error
    class ValidationError < StandardError; end
  end
end