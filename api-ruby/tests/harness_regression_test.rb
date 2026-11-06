require 'minitest/autorun'
require_relative 'CompatibilitySupport'
require 'socket'
require 'timeout'

class HarnessRegressionTest < Minitest::Test
  def test_a_read_failure_does_not_suppress_other_read_cases
    previous = $compatibility_results
    $compatibility_results = []
    client = Object.new
    client.define_singleton_method(:list_providers) { raise 'injected provider failure' }
    %i[get_verification_profile_by_id list_verification_profiles list_sessions list get_provider].each do |method|
      client.define_singleton_method(method) { |*_args| nil }
    end
    %w[test_list_providers test_get_profile test_list_profiles test_list_sessions test_list_redirects test_get_provider].each do |name|
      instance = CompatibilityTest.new(name)
      instance.define_singleton_method(:setup) { @providers = @profiles = @sessions = @redirects = client; @profile = 'profile' }
      instance.define_singleton_method(:teardown) {}
      result = instance.run
      assert_equal(name == 'test_list_providers' ? 1 : 0, result.failures.length)
    end
    assert_equal 6, $compatibility_results.length
    assert_equal 1, $compatibility_results.count { |entry| entry['status'] == 'failed' }
  ensure
    $compatibility_results = previous
  end

  def test_array_lengths_are_required_even_when_new_object_fields_are_allowed
    [false, true].each do |exact|
      assert_raises(RuntimeError) { compare_json([{ 'name' => 'Ada' }], [{ 'name' => 'Ada' }, { 'name' => 'Bob' }], 'items', exact) }
      assert_raises(RuntimeError) { compare_json([], [1], 'items', exact) }
      assert_raises(RuntimeError) { compare_json([1, 2], [1], 'items', exact) }
      compare_json([nil, 1], [nil, 1], 'items', exact)
    end
    compare_json([{ 'name' => 'Ada' }], [{ 'name' => 'Ada', 'new' => true }], 'items', false)
  end

  def test_native_reporter_preserves_independent_errors_beside_recorded_sdk_failures
    reporter = CompatibilityReporter.new
    result = Minitest::Result.new('test_example')
    result.klass = 'CompatibilityTest'
    result.failures = [RecordedCompatibilityFailure.new('SDK failed'), Minitest::UnexpectedError.new(RuntimeError.new('cleanup broke'))]
    assert_instance_of Minitest::Assertion, result.failures[0]
    reporter.record(result)
    reporter.report
    assert reporter.complete
    assert_equal 'compatibility', reporter.failures[0]['name']
    assert_equal 'CompatibilityTest.test_example:1', reporter.failures[1]['name']
    assert_match(/cleanup broke/, reporter.failures[1]['message'])
  end

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
