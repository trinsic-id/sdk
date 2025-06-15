# frozen_string_literal: true

require_relative 'exchange_result_request'
require_relative 'result_exchanger'
require_relative 'result_processor'

# Trinsic ServiceResults Ruby implementation
#
# This module provides standardized result handling and exchange functionality
# for the Trinsic SDK.
module Trinsic
  module ServiceResults
    VERSION = '1.0.0'
    
    # Convenience method to create an ExchangeResultRequest
    #
    # @param session_id [String] The session identifier
    # @param results_access_key [String] The results access key
    # @return [ExchangeResultRequest] New request instance
    def self.create_request(session_id, results_access_key)
      ExchangeResultRequest.new(session_id, results_access_key)
    end

    # Convenience method to create a ResultExchanger
    #
    # @param sessions_api [SessionsApiInterface] The sessions API implementation
    # @return [ResultExchanger] New exchanger instance
    def self.create_exchanger(sessions_api)
      ResultExchanger.new(sessions_api)
    end

    # Convenience method to create a ResultProcessor
    #
    # @return [Class] The ResultProcessor class
    def self.processor
      ResultProcessor
    end
  end
end