require 'trinsic_api'

TrinsicApi.configure do |config|
  config.access_token = ENV['TRINSIC_ACCESS_TOKEN']
end

module TrinsicServices
  SESSIONS = TrinsicApi::SessionsApi.new
end