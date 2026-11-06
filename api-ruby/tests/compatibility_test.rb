require 'minitest/autorun'
require_relative 'CompatibilitySupport'
Minitest.after_run { write_results }

class CompatibilityTest < Minitest::Test
  def setup
    config = TrinsicApi::Configuration.default; configure_base_url(config, ENV.fetch('TRINSIC_TEST_BASE_URL')); config.access_token = ENV.fetch('TRINSIC_TEST_ACCESS_TOKEN')
    @created_sessions = []
    @profile = ENV.fetch('TRINSIC_TEST_VERIFICATION_PROFILE_ID'); @providers = TrinsicApi::ProvidersApi.new; @profiles = TrinsicApi::VerificationProfilesApi.new; @sessions = TrinsicApi::SessionsApi.new; @redirects = TrinsicApi::RedirectUrisApi.new
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
    session
  end
  def run_case(id, params = {}, &action)
    value = record(id, params, &action); raise RecordedCompatibilityFailure.new("#{id} failed; see compatibility result for details") if $compatibility_results.last['status'] == 'failed'; value
  end
  def redirect_url
    value = find_http(as_hash(@redirects.list)); raise 'No HTTP(S) redirect URI is registered.' unless value; value
  end
  def create_direct
    attributes = { provider: 'trinsic-test-redirect', verification_profile_id: @profile, redirect_url: redirect_url, capabilities: %w[LaunchBrowser CaptureRedirect], fallback_to_hosted_ui: false }; track(response_body(@sessions.create_direct_provider_session(create_direct_provider_session_request: model('CreateDirectProviderSessionRequest', attributes))))
  end
  def completed_result
    session = create_direct; token, key = completed_redirect_session(session); attributes = { results_access_key: key }; [session, key, @sessions.get_session_result(session.session_id, get_session_result_request: model('GetSessionResultRequest', attributes))]
  end
  def test_list_providers = run_case('api.providers.list') { @providers.list_providers }
  def test_get_profile = run_case('api.verification-profiles.get-by-id') { @profiles.get_verification_profile_by_id(@profile) }
  def test_list_profiles = run_case('api.verification-profiles.list') { @profiles.list_verification_profiles }
  def test_list_sessions = run_case('api.sessions.list') { @sessions.list_sessions(@profile) }
  def test_list_redirects = run_case('api.redirect-uris.list') { @redirects.list }
  def test_get_provider = run_case('api.providers.get') { @providers.get_provider('trinsic-test-redirect') }
  def test_create_hosted
    run_case('api.sessions.create-hosted-provider') { attributes = { provider: 'trinsic-test-redirect', verification_profile_id: @profile, redirect_url: redirect_url }; track(response_body(@sessions.create_hosted_provider_session(create_hosted_provider_session_request: model('CreateHostedProviderSessionRequest', attributes)))) }
  end
  def test_create_direct
    run_case('api.sessions.create-direct-provider') { create_direct }
  end
  def test_get_direct
    run_case('api.sessions.get') do
      session = create_direct
      @sessions.get_session(session.session_id)
    end
  end
  def test_cancel_direct
    run_case('api.sessions.cancel') { session = create_direct; @sessions.cancel_session(session.session_id) }
  end
  def test_get_result
    run_case('api.sessions.get-result') { completed_result.last }
  end
  def test_get_attachment
    run_case('api.sessions.get-attachment') do
      session, key, result = completed_result
      attachment = attachment_id(result)
      raise 'Completed redirect session did not return an attachment.' unless attachment
      @sessions.get_attachment(session.session_id, attachment, get_attachment_request: model('GetAttachmentRequest', results_access_key: key))
    end
  end
  def test_redact
    run_case('api.sessions.redact') { session = create_direct; completed_redirect_session(session); @sessions.redact_session(session.session_id) }
  end
  def test_recommendations
    run_case('api.sessions.recommend-providers') { @sessions.recommend_providers(recommend_providers_request: model('RecommendProvidersRequest', verification_profile_id: @profile, health: 'All')) }
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
      else; record(case_id, params) { raise 'fixture omitted output' unless fixture['output']; compare_json(normalize_json(TrinsicApi.const_get(name).build_from_hash(fixture['output']).to_hash), fixture['serializationOutput'] || fixture['output'], fixture['providerId'], !!fixture['testCaseId']) }
      end
    end
    failures = $compatibility_results.drop(first_result).select { |result| result['status'] == 'failed' }
    raise RecordedCompatibilityFailure.new('Serialization cases failed; see the structured report.') unless failures.empty?
  end
end
