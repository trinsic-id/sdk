require 'trinsic_api'
require 'uri'

url = URI(ENV.fetch('SDK_TEST_URL'))
config = TrinsicApi::Configuration.new
config.scheme = url.scheme
config.host = "#{url.host}:#{url.port}"
config.base_path = ''
config.ignore_operation_servers = true
config.access_token = 'sdk-header-test-token'
client = TrinsicApi::ApiClient.new(config)
client.default_headers = { 'X-Test-Header' => 'preserved' }
TrinsicApi::ProvidersApi.new(client).list_providers
TrinsicApi::SessionsApi.new(client).cancel_session('00000000-0000-0000-0000-000000000001')
