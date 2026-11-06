require 'minitest/autorun'
require_relative 'CompatibilitySupport'
require 'socket'
require 'timeout'
require 'ostruct'

class HarnessRegressionTest < Minitest::Test
  SESSION = { 'id' => '00000000-0000-4000-8000-000000000001', 'done' => false, 'success' => false, 'created' => 1, 'updated' => 1 }.freeze
  PROVIDER = {
    'id' => 'provider', 'name' => 'Provider', 'logoUrl' => 'https://example.test/logo', 'subtext' => 'Description', 'health' => 'Healthy',
    'regions' => [], 'countries' => ['US'], 'subdivisions' => [],
    'subProviders' => [{ 'id' => 'sub', 'name' => 'Sub', 'subtext' => 'Description', 'logoUrl' => 'https://example.test/sub' }]
  }.freeze

  def compare_response(decoded, wire)
    compare_json(model_fields(decoded, wire, true), model_fields(decoded, wire), 'response', true)
  end

  [0, 1].each do |count|
    define_method("test_published_session_model_preserves_#{count}_entries") do
      wire = { 'sessions' => [SESSION].take(count), 'total' => count, 'more' => false, 'futureField' => 'ignored' }
      decoded = TrinsicApi::ListSessionsResponse.build_from_hash(wire)
      compare_response(decoded, wire)
    end
  end

  %w[truncate id total more].each do |mutation|
    define_method("test_published_session_model_rejects_changed_#{mutation}") do
      wire = { 'sessions' => [SESSION], 'total' => 1, 'more' => false }
      decoded = TrinsicApi::ListSessionsResponse.build_from_hash(wire)
      compare_response(decoded, wire)
      case mutation
      when 'truncate' then decoded.sessions = []
      when 'id' then decoded.sessions[0].id = '00000000-0000-4000-8000-000000000002'
      when 'total' then decoded.total = 2
      when 'more' then decoded.more = true
      end
      assert_raises(RuntimeError) { compare_response(decoded, wire) }
    end
  end

  %i[recommended_providers remainder].each do |field|
    %w[unchanged provider country subprovider].each do |mutation|
      define_method("test_published_recommendation_model_#{field}_#{mutation}") do
        wire = { 'recommendedProviders' => [PROVIDER], 'remainder' => [PROVIDER], 'futureField' => 'ignored' }
        decoded = TrinsicApi::RecommendProvidersResponse.build_from_hash(wire)
        compare_response(decoded, wire)
        next if mutation == 'unchanged'
        providers = decoded.public_send(field)
        case mutation
        when 'provider' then providers.clear
        when 'country' then providers[0].countries = []
        when 'subprovider' then providers[0].sub_providers[0].name = 'Changed'
        end
        assert_raises(RuntimeError) { compare_response(decoded, wire) }
      end
    end
  end

  def test_a_read_failure_does_not_suppress_other_read_cases
    previous = $compatibility_results
    $compatibility_results = []
    client = Object.new
    client.define_singleton_method(:list_providers) { raise 'injected provider failure' }
    client.define_singleton_method(:last_request) { OpenStruct.new(options: { params: { Page: 1, PageSize: 1, page: 1, pageSize: 1 } }) }
    client.define_singleton_method(:get_verification_profile_by_id) { |id| OpenStruct.new(id: id) }
    client.define_singleton_method(:get_provider) { |id| OpenStruct.new(provider: OpenStruct.new(id: id)) }
    { list_verification_profiles: :verification_profiles, list_sessions: :sessions, list: :uris }.each do |method, field|
      client.define_singleton_method(method) { |*_args| OpenStruct.new(field => [], more: false) }
    end
    %w[test_list_providers test_get_profile test_list_profiles test_list_sessions test_list_redirects test_get_provider].each do |name|
      instance = CompatibilityTest.new(name)
      instance.define_singleton_method(:setup) { @providers = @profiles = @sessions = @redirects = @client = client; @profile = 'profile' }
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

  def test_scalar_types_and_timestamp_precision_are_preserved
    [[true, 1], [false, 0], [[], {}], ['2026-08-14T12:00:00.100Z', '2026-08-14T12:00:00.900Z']].each do |actual, expected|
      assert_raises(RuntimeError) { compare_json(actual, expected, 'field', true) }
    end
    compare_json(1, 1.0, 'number', true)
  end

  def test_supported_fields_cannot_disappear_and_unknown_fields_are_allowed
    wire = { 'method' => 'LaunchBrowser', 'content' => 'https://example.test', 'future' => true }
    model = TrinsicApi::IntegrationStep.build_from_hash(wire)
    expected = model_fields(model, wire)
    refute expected.key?('future')
    compare_json(model_fields(model, wire, true), expected, 'step', true)
    assert_raises(RuntimeError) { compare_json({ 'method' => 'LaunchBrowser' }, expected, 'step', true) }
    assert_raises(RuntimeError) { model_fields({}, { 'key' => true }, true) }
    assert_equal({ 'key' => false }, model_fields({ 'key' => false }, { 'key' => false }, true))
  end

  def test_wrong_session_and_empty_attachment_are_rejected
    assert_raises(RuntimeError) { assert_session(OpenStruct.new(session: OpenStruct.new(id: 'wrong', done: true, success: true)), 'expected', true, true) }
    assert_raises(RuntimeError) { assert_attachment(OpenStruct.new(content_type: 'image/png', content: '')) }
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
