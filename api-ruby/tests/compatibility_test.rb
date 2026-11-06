require 'minitest/autorun'
require_relative 'CompatibilitySupport'
Minitest.after_run { write_results }

class CompatibilityTest < Minitest::Test
  def setup
    config = TrinsicApi::Configuration.default; configure_base_url(config, ENV.fetch('TRINSIC_TEST_BASE_URL')); config.access_token = ENV.fetch('TRINSIC_TEST_ACCESS_TOKEN')
    @created_sessions = []
    @profile = ENV.fetch('TRINSIC_TEST_VERIFICATION_PROFILE_ID'); @client = CapturingClient.new(config)
    @providers = TrinsicApi::ProvidersApi.new(@client); @profiles = TrinsicApi::VerificationProfilesApi.new(@client); @sessions = TrinsicApi::SessionsApi.new(@client); @redirects = TrinsicApi::RedirectUrisApi.new(@client)
  end
  def teardown
    @created_sessions.each do |session|
      begin; @sessions.cancel_session(session.session_id)
      rescue StandardError; # Completed/redacted sessions may no longer be cancellable.
      end
    end
  end
  def track(session)
    @created_sessions << session
    assert_created(session, session.respond_to?(:launch_url))
  end
  def run_case(id, params = {}, &action)
    value = record(id, params, &action); raise RecordedCompatibilityFailure.new("#{id} failed; see compatibility result for details") if $compatibility_results.last['status'] == 'failed'; value
  end
  def redirect_url
    value = find_http(as_hash(@redirects.list)); raise 'No HTTP(S) redirect URI is registered.' unless value; value
  end
  def create_direct
    attributes = { provider: 'trinsic-test-redirect', verification_profile_id: @profile, redirect_url: redirect_url, capabilities: %w[LaunchBrowser CaptureRedirect], fallback_to_hosted_ui: false }; session = track(response_body(@sessions.create_direct_provider_session(create_direct_provider_session_request: model('CreateDirectProviderSessionRequest', attributes))))
    assert_request(@client, { 'provider' => 'trinsic-test-redirect', 'verificationProfileId' => @profile, 'capabilities' => %w[LaunchBrowser CaptureRedirect], 'fallbackToHostedUI' => false })
    session
  end
  def completed_result
    session = create_direct; token, key = completed_redirect_session(session); attributes = { results_access_key: key }; [session, key, @sessions.get_session_result(session.session_id, get_session_result_request: model('GetSessionResultRequest', attributes))]
  end
  def test_list_providers = run_case('api.providers.list') { raise 'No providers' if @providers.list_providers.providers.empty? }
  def test_get_profile = run_case('api.verification-profiles.get-by-id') { raise 'Profile ID differs' unless @profiles.get_verification_profile_by_id(@profile).id.downcase == @profile.downcase }
  def test_list_profiles = run_case('api.verification-profiles.list') { assert_page(@profiles.list_verification_profiles, :verification_profiles) }
  def test_list_sessions = run_case('api.sessions.list') do
      assert_page(@sessions.list_sessions(@profile, page: 1, page_size: 1), :sessions)
      raise 'Session pagination request differs' unless @client.last_request.options[:params].slice(:Page, :PageSize).values == [1, 1]
    end
  def test_list_redirects = run_case('api.redirect-uris.list') do
      assert_page(@redirects.list(page: 1, page_size: 1), :uris)
      raise 'Redirect pagination request differs' unless @client.last_request.options[:params].slice(:page, :pageSize).values == [1, 1]
    end
  def test_get_provider = run_case('api.providers.get') { raise 'Provider ID differs' unless @providers.get_provider('trinsic-test-redirect').provider.id == 'trinsic-test-redirect' }
  def test_create_hosted
    run_case('api.sessions.create-hosted-provider') { attributes = { provider: 'trinsic-test-redirect', verification_profile_id: @profile, redirect_url: redirect_url }; track(response_body(@sessions.create_hosted_provider_session(create_hosted_provider_session_request: model('CreateHostedProviderSessionRequest', attributes)))) }
  end
  def test_create_direct
    run_case('api.sessions.create-direct-provider') { create_direct }
  end
  def test_get_direct
    run_case('api.sessions.get') do
      session = create_direct
      assert_session(@sessions.get_session(session.session_id), session.session_id, false, false)
    end
  end
  def test_cancel_direct
    run_case('api.sessions.cancel') { session = create_direct; assert_session(@sessions.cancel_session(session.session_id), session.session_id, true, false) }
  end
  def test_get_result
    run_case('api.sessions.get-result') do
      session, _, result = completed_result
      assert_session(result, session.session_id, true, true)
      raise 'Missing test identity data' unless result.identity_data.originating_provider_id == 'trinsic-test-redirect' && !result.identity_data.attachments.empty?
    end
  end
  def test_get_attachment
    run_case('api.sessions.get-attachment') do
      session, key, result = completed_result
      attachment = attachment_id(result)
      raise 'Completed redirect session did not return an attachment.' unless attachment
      assert_attachment(@sessions.get_attachment(session.session_id, attachment, get_attachment_request: model('GetAttachmentRequest', results_access_key: key)))
    end
  end
  def test_redact
    run_case('api.sessions.redact') { session = create_direct; completed_redirect_session(session); @sessions.redact_session(session.session_id) }
  end
  def test_recommendations
    run_case('api.sessions.recommend-providers') do
      response = @sessions.recommend_providers(recommend_providers_request: model('RecommendProvidersRequest', verification_profile_id: @profile, health: 'All'))
      providers = response.recommended_providers + response.remainder
      raise 'No recommendations' if providers.empty?
      providers.each do |provider|
        %i[id name logo_url subtext health].each { |field| raise "Invalid #{field}" unless provider.public_send(field).is_a?(String) }
        %i[regions countries subdivisions].each { |field| raise "Invalid #{field}" unless provider.public_send(field).is_a?(Array) && provider.public_send(field).all? { |item| item.is_a?(String) } }
      end
      assert_request(@client, { 'verificationProfileId' => @profile, 'health' => 'All' })
    end
  end
  def test_provider_outputs
    cache = ENV['SDK_COMPATIBILITY_PSO_FIXTURES_PATH']; unless cache && File.file?(cache); record_skip('serialization.provider-output-round-trip', 'No shared PSO fixture cache was available.'); return; end
    first_result = $compatibility_results.length
    JSON.parse(File.read(cache))['fixtures'].each do |fixture|
      case_id = fixture['testCaseId'] || 'serialization.provider-output-round-trip'
      params = { 'providerId' => fixture['providerId'] }; name = fixture['sdkModelName']; params['sdkModelName'] = name if name
      if !fixture['hasPublicSdkModel']; record_skip(case_id, 'Provider has no public Swagger provider-specific output model.', params)
      elsif !name || !TrinsicApi.const_defined?(name)
        record_skip(case_id, 'Model is not exported by this SDK release.', params)
      elsif !TrinsicApi.const_get(name).respond_to?(:build_from_hash); record(case_id, params) { raise 'The SDK does not expose a wire-JSON deserializer for this provider-output model.' }
      else
        record(case_id, params) do
          raw = fixture.fetch('output'); decoded = TrinsicApi.const_get(name).build_from_hash(raw)
          compare_json(model_fields(decoded, raw, true), model_fields(decoded, raw), fixture['providerId'], true)
          expected = fixture['serializationOutput'] || raw
          expected = model_fields(decoded, expected) unless fixture['testCaseId']
          compare_json(JSON.parse(@client.object_to_http_body(decoded)), expected, fixture['providerId'], true)
        end
      end
    end
    failures = $compatibility_results.drop(first_result).select { |result| result['status'] == 'failed' }
    raise RecordedCompatibilityFailure.new('Serialization cases failed; see the structured report.') unless failures.empty?
  end
end
