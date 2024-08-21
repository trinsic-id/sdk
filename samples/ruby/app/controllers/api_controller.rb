# app/controllers/providers_controller.rb
require "trinsic_connect"

class ApiController < ApplicationController
  def initialize
    super()

    @api_client = TrinsicConnect::ApiClient.new
    @api_client.config.api_key['Authorization'] = 'Bearer ' + ENV['CONNECT_ACCESS_TOKEN']
    @network_api = TrinsicConnect::NetworkApi.new(@api_client)
    @session_api = TrinsicConnect::SessionApi.new(@api_client)
  end
  def providers
    result = @network_api.list_providers
    render json: result
  rescue => e
    # Handle any errors that might occur
    render json: { error: e.message }, status: :internal_server_error
  end
end
