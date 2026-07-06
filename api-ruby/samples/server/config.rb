require 'trinsic_api'

TrinsicApi.configure do |config|
  # For EU data residency, point the SDK at the EU endpoint.
  # Contact Trinsic support to enable EU residency.
  # config.host = 'https://api.eu.trinsic.id'
  config.access_token = ENV['TRINSIC_ACCESS_TOKEN']
end

module TrinsicServices
  SESSIONS = TrinsicApi::SessionsApi.new
end
