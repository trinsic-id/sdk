require 'minitest/autorun'
require_relative 'CompatibilitySupport'
Minitest.after_run { write_results }

class CompatibilityTest < Minitest::Test
  def setup
    config = TrinsicApi::Configuration.default; config.host = ENV.fetch('TRINSIC_TEST_BASE_URL'); config.access_token = ENV.fetch('TRINSIC_TEST_ACCESS_TOKEN')
    @profile = ENV.fetch('TRINSIC_TEST_VERIFICATION_PROFILE_ID'); @providers = TrinsicApi::ProvidersApi.new; @profiles = TrinsicApi::VerificationProfilesApi.new; @sessions = TrinsicApi::SessionsApi.new; @redirects = TrinsicApi::RedirectUrisApi.new
  end
  def run_case(id, params = {}, &action)
    value = record(id, params, &action); flunk "#{id} failed; see compatibility result for details" if $compatibility_results.last['status'] == 'failed'; value
  end
  def redirect_url
    value = find_http(as_hash(@redirects.list)); raise 'No HTTP(S) redirect URI is registered.' unless value; value
  end
  def create_direct
    attributes = { provider: 'trinsic-test-redirect', verification_profile_id: @profile, redirect_url: redirect_url, capabilities: %w[LaunchBrowser CaptureRedirect], fallback_to_hosted_ui: false }; attributes[:enable_redirect_backwards_compatibility] = false if supports_attribute?('CreateDirectProviderSessionRequest', :enable_redirect_backwards_compatibility); response_body(@sessions.create_direct_provider_session(create_direct_provider_session_request: model('CreateDirectProviderSessionRequest', attributes)))
  end
  def completed_result
    session = create_direct; token, key = completed_redirect_session(session); attributes = { results_access_key: key }; attributes[:redirect_token] = token if supports_attribute?('GetSessionResultRequest', :redirect_token); [session, key, @sessions.get_session_result(session.session_id, get_session_result_request: model('GetSessionResultRequest', attributes))]
  end
  def test_read_apis
    run_case('api.providers.list') { @providers.list_providers }; run_case('api.verification-profiles.get-by-id') { @profiles.get_verification_profile_by_id(@profile) }; run_case('api.verification-profiles.list') { @profiles.list_verification_profiles }; run_case('api.sessions.list') { @sessions.list_sessions(@profile) }; run_case('api.redirect-uris.list') { @redirects.list }
    @providers.respond_to?(:get_provider) ? run_case('api.providers.get') { @providers.get_provider('trinsic-test-redirect') } : record_skip('api.providers.get', 'ProvidersApi.get_provider was introduced in 3.1.0.')
  end
  def test_create_hosted
    run_case('api.sessions.create-hosted-provider') { attributes = { provider: 'trinsic-test-redirect', verification_profile_id: @profile, redirect_url: redirect_url }; attributes[:enable_redirect_backwards_compatibility] = false if supports_attribute?('CreateHostedProviderSessionRequest', :enable_redirect_backwards_compatibility); session = response_body(@sessions.create_hosted_provider_session(create_hosted_provider_session_request: model('CreateHostedProviderSessionRequest', attributes))); @sessions.cancel_session(session.session_id); session }
  end
  def test_create_direct
    session = run_case('api.sessions.create-direct-provider') { create_direct }; @sessions.cancel_session(session.session_id) if session
  end
  def test_get_direct
    session = create_direct
  rescue StandardError
    record_skip('api.sessions.get', 'Direct-session setup failed.'); skip 'Direct-session setup failed.'
  else
    run_case('api.sessions.get') { @sessions.get_session(session.session_id) }
    @sessions.cancel_session(session.session_id)
  end
  def test_cancel_direct
    session = create_direct
  rescue StandardError
    record_skip('api.sessions.cancel', 'Direct-session setup failed.'); skip 'Direct-session setup failed.'
  else
    run_case('api.sessions.cancel') { @sessions.cancel_session(session.session_id) }
  end
  def test_get_result
    run_case('api.sessions.get-result') { completed_result.last }
  end
  def test_get_attachment
    session, key, result = completed_result; attachment = attachment_id(result); raise 'Completed redirect session did not return an attachment.' unless attachment
  rescue StandardError
    record_skip('api.sessions.get-attachment', 'Redirect-session setup or result retrieval failed.'); skip 'Redirect-session setup or result retrieval failed.'
  else
    run_case('api.sessions.get-attachment') { @sessions.get_attachment(session.session_id, attachment, get_attachment_request: model('GetAttachmentRequest', results_access_key: key)) }
  end
  def test_redact
    session, = completed_result
  rescue StandardError
    record_skip('api.sessions.redact', 'Redirect-session setup or result retrieval failed.'); skip 'Redirect-session setup or result retrieval failed.'
  else
    run_case('api.sessions.redact') { @sessions.redact_session(session.session_id) }
  end
  def test_recommendations
    run_case('api.sessions.recommend-providers') { @sessions.recommend_providers(recommend_providers_request: model('RecommendProvidersRequest', verification_profile_id: @profile, health: 'All')) }
  end
  def test_provider_outputs
    cache = ENV['SDK_COMPATIBILITY_PSO_FIXTURES_PATH']; unless cache && File.file?(cache); record_skip('serialization.provider-output-round-trip', 'No shared PSO fixture cache was available.'); return; end
    JSON.parse(File.read(cache))['fixtures'].each do |fixture|
      params = { 'providerId' => fixture['providerId'] }; name = fixture['sdkModelName']; params['sdkModelName'] = name if name
      if !fixture['hasPublicSdkModel']; record_skip('serialization.provider-output-round-trip', 'Provider has no public Swagger provider-specific output model.', params)
      elsif !name || !TrinsicApi.const_defined?(name)
        ENV['SDK_IS_CURRENT'] == 'true' && !allow_missing_pso_models? ? record('serialization.provider-output-round-trip', params) { raise "Connect declares #{fixture['providerId']}'s #{name} output as public, but this SDK does not expose #{name}." } : record_skip('serialization.provider-output-round-trip', ENV['SDK_IS_CURRENT'] == 'true' ? 'Missing public provider-output models are temporarily allowed by SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS.' : 'The published SDK does not expose this provider-output model.', params)
      elsif !TrinsicApi.const_get(name).respond_to?(:build_from_hash); record_skip('serialization.provider-output-round-trip', 'The SDK does not expose a wire-JSON deserializer for this provider-output model.', params)
      else; record('serialization.provider-output-round-trip', params) { raise 'fixture omitted output' unless fixture['output']; compare_json(normalize_json(TrinsicApi.const_get(name).build_from_hash(fixture['output']).to_hash), fixture['serializationOutput'] || fixture['output'], fixture['providerId'], ENV['SDK_IS_CURRENT'] == 'true') }
      end
    end
  end
end
