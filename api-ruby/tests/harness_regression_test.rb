require 'minitest/autorun'
require_relative 'CompatibilitySupport'
require 'socket'
require 'timeout'

class HarnessRegressionTest < Minitest::Test
  def test_client_sends_http_requests_under_the_configured_prefix
    server = TCPServer.new('127.0.0.1', 0)
    request_line = nil
    worker = Thread.new do
      socket = server.accept
      begin
        request_line = socket.gets
        loop { break if socket.gets == "\r\n" }
        body = '{"providers":[]}'
        socket.write("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: #{body.bytesize}\r\nConnection: close\r\n\r\n#{body}")
      ensure
        socket.close
      end
    end
    config = TrinsicApi::Configuration.new
    configure_base_url(config, "http://127.0.0.1:#{server.addr[1]}/prefix")
    config.timeout = 5
    result = Timeout.timeout(10) { TrinsicApi::ProvidersApi.new(TrinsicApi::ApiClient.new(config)).list_providers }
    worker.join
    assert_empty result.providers
    assert_match(%r{\AGET /prefix/api/v1/providers(?:\?| )}, request_line)
  ensure
    worker&.kill
    server&.close
  end

  def test_base_url_preserves_scheme_port_and_prefix
    config = TrinsicApi::Configuration.new
    {
      'http://127.0.0.1:5000/prefix' => 'http://127.0.0.1:5000/prefix',
      'https://example.test/nested/prefix/' => 'https://example.test/nested/prefix',
      'http://[::1]:5000/prefix' => 'http://[::1]:5000/prefix',
      'https://api.trinsic-development.com' => 'https://api.trinsic-development.com'
    }.each do |input, expected|
      configure_base_url(config, input)
      assert_equal expected, config.base_url
    end
  end

  def test_base_url_requires_an_absolute_http_url
    %w[/prefix ftp://example.test/prefix].each do |url|
      assert_raises(RuntimeError) { configure_base_url(TrinsicApi::Configuration.new, url) }
    end
  end
end
