require 'minitest/autorun'
require 'rack/test'
require_relative './app' # Make sure to point to your Sinatra app file

class MyAppTest < Minitest::Test
  include Rack::Test::Methods

  def app
    MyApp
  end

  def test_app_loads
    assert app, "The Sinatra app should load"
  end

  def test_trinsic_api_methods
    assert defined?(TrinsicApi::NetworkApi), "TrinsicApi::NetworkApi should be defined"
    assert defined?(TrinsicApi::SessionsApi), "TrinsicApi::SessionsApi should be defined"
    assert TrinsicApi::NetworkApi.instance_methods.include?(:list_providers), "list_providers method should be defined in TrinsicApi::NetworkApi"
    assert TrinsicApi::SessionsApi.instance_methods.include?(:create_session), "create_session method should be defined in TrinsicApi::SessionsApi"
    assert TrinsicApi::SessionsApi.instance_methods.include?(:get_session_result), "get_session_result method should be defined in TrinsicApi::SessionsApi"
  end
end
