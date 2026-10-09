require 'json'; require 'net/http'; require 'time'; require 'trinsic_api'; require 'uri'
$results=[]
def record(id, params={}); started=Process.clock_gettime(Process::CLOCK_MONOTONIC); value=yield; $results<<{'id'=>id,'status'=>'passed','durationMs'=>((Process.clock_gettime(Process::CLOCK_MONOTONIC)-started)*1000).to_i,'parameters'=>params}; value; rescue=>e; $results<<{'id'=>id,'status'=>'failed','durationMs'=>((Process.clock_gettime(Process::CLOCK_MONOTONIC)-started)*1000).to_i,'parameters'=>params,'failure'=>{'name'=>e.class.name,'message'=>e.message}}; nil; end
def skip(id,reason,params={}); $results<<{'id'=>id,'status'=>'skipped','durationMs'=>0,'parameters'=>params,'skipReason'=>reason}; end
def model(name,attributes); TrinsicApi.const_get(name).new(attributes); end
def as_hash(value); value.respond_to?(:to_hash) ? value.to_hash : value; end
def response_body(value); value.is_a?(Array) && value.length == 3 && value.last.is_a?(Hash) ? value[0] : value; end
def normalize_json(value); JSON.parse(JSON.generate(value)); end
def equivalent_timestamp?(actual,expected); actual.match?(/^\d{4}-\d{2}-\d{2}[ T]/) && expected.match?(/^\d{4}-\d{2}-\d{2}[ T]/) && Time.parse(actual).utc == Time.parse(expected).utc rescue false; end
def compare_json(actual,expected,path,exact)
  if actual.is_a?(Hash) && expected.is_a?(Hash)
    actual.each{|key,value| raise "#{path}: SDK emitted field #{key.inspect} absent from fixture." unless expected.key?(key); compare_json(value,expected[key],"#{path}.#{key}",exact)}
    raise "#{path}: field names differ; SDK=#{actual.keys.sort}, wire=#{expected.keys.sort}." if exact && actual.keys.sort != expected.keys.sort
  elsif actual.is_a?(Array) && expected.is_a?(Array)
    raise "#{path}: array lengths differ." if exact && actual.length != expected.length
    actual.each_with_index{|value,index| raise "#{path}[#{index}]: SDK emitted an array value absent from fixture." if index >= expected.length; compare_json(value,expected[index],"#{path}[#{index}]",exact)}
  elsif actual != expected && !(actual.is_a?(String) && expected.is_a?(String) && equivalent_timestamp?(actual,expected))
    raise "#{path}: values differ; SDK=#{actual.inspect}, wire=#{expected.inspect}."
  end
end
def supports_attribute?(model_name,attribute); TrinsicApi.const_get(model_name).attribute_map.key?(attribute); end
def find_http(value); return value if value.is_a?(String) && value.match?(%r{^https?://}); return value.values.lazy.map{|v|find_http(v)}.find{|v|v} if value.is_a?(Hash); return value.lazy.map{|v|find_http(v)}.find{|v|v} if value.is_a?(Array); nil; end
class BrowserSession
  def initialize; @cookies=[]; end
  def fetch(url)
    uri=URI(url); request=Net::HTTP::Get.new(uri); request['Cookie']=@cookies.join('; ') unless @cookies.empty?
    response=Net::HTTP.start(uri.host,uri.port,use_ssl:uri.scheme=='https'){|http|http.request(request)}
    @cookies=response.get_fields('set-cookie').to_a.map{|cookie|cookie.split(';',2).first} unless response.get_fields('set-cookie').to_a.empty?
    [response.code.to_i,response['location'],url]
  end
end
def completed_redirect_session(session)
  browser=BrowserSession.new; status,location,source=browser.fetch(session.next_step.content); raise 'Direct session launch did not redirect to the test integration.' unless status==302 && location
  integration=URI.join(source,location); callback=URI(URI.decode_www_form(integration.query.to_s).to_h.fetch('redirectUrl')); query=URI.decode_www_form(callback.query.to_s).to_h; query['resultState']='success'; callback.query=URI.encode_www_form(query)
  _,location,source=browser.fetch(callback.to_s); raise 'Test integration callback did not redirect.' unless location
  _,location,source=browser.fetch(URI.join(source,location).to_s); raise 'Verification completion did not redirect.' unless location
  _,location,source=browser.fetch(URI.join(source,location).to_s); raise 'Redirect completion did not redirect.' unless location
  application=URI.join(source,location); token=URI.decode_www_form(application.query.to_s).to_h.fetch('redirectToken'); [token,session.result_collection.results_access_key]
end
def attachment_id(result); result&.identity_data&.attachments&.first&.id; end
config=TrinsicApi::Configuration.default; config.host=ENV['TRINSIC_TEST_BASE_URL']; config.access_token=ENV['TRINSIC_TEST_ACCESS_TOKEN']; profile=ENV['TRINSIC_TEST_VERIFICATION_PROFILE_ID']; providers=TrinsicApi::ProvidersApi.new; profiles=TrinsicApi::VerificationProfilesApi.new; sessions=TrinsicApi::SessionsApi.new; redirects=TrinsicApi::RedirectUrisApi.new
record('api.providers.list'){providers.list_providers}; record('api.verification-profiles.get-by-id'){profiles.get_verification_profile_by_id(profile)}; record('api.verification-profiles.list'){profiles.list_verification_profiles}; record('api.sessions.list'){sessions.list_sessions(profile)}; record('api.redirect-uris.list'){redirects.list}; providers.respond_to?(:get_provider) ? record('api.providers.get'){providers.get_provider('trinsic-test-redirect')} : skip('api.providers.get','ProvidersApi.get_provider was introduced in 3.1.0.')
redirect=record('api.sessions.create-hosted-provider'){ uri=find_http(as_hash(redirects.list)); raise 'No HTTP(S) redirect URI is registered.' unless uri; attributes={provider:'trinsic-test-redirect',verification_profile_id:profile,redirect_url:uri}; attributes[:enable_redirect_backwards_compatibility]=false if supports_attribute?('CreateHostedProviderSessionRequest',:enable_redirect_backwards_compatibility); request=model('CreateHostedProviderSessionRequest',attributes); response=response_body(sessions.create_hosted_provider_session(create_hosted_provider_session_request:request)); sessions.cancel_session(response.session_id); response }
create_direct=lambda { uri=find_http(as_hash(redirects.list)); attributes={provider:'trinsic-test-redirect',verification_profile_id:profile,redirect_url:uri,capabilities:%w[LaunchBrowser CaptureRedirect],fallback_to_hosted_ui:false}; attributes[:enable_redirect_backwards_compatibility]=false if supports_attribute?('CreateDirectProviderSessionRequest',:enable_redirect_backwards_compatibility); request=model('CreateDirectProviderSessionRequest',attributes); response_body(sessions.create_direct_provider_session(create_direct_provider_session_request:request)) }
direct=record('api.sessions.create-direct-provider'){ create_direct.call }
if direct
  id=direct.session_id; record('api.sessions.get'){sessions.get_session(id)}; record('api.sessions.cancel'){sessions.cancel_session(id)}
else
  %w[get cancel].each{|id|skip("api.sessions.#{id}",'Direct-session setup failed.')}
end
completed=nil; result=record('api.sessions.get-result'){ session=create_direct.call; token,key=completed_redirect_session(session); completed={session:session,token:token,key:key}; attributes={results_access_key:key}; attributes[:redirect_token]=token if supports_attribute?('GetSessionResultRequest',:redirect_token); sessions.get_session_result(session.session_id,get_session_result_request:model('GetSessionResultRequest',attributes))}; attachment=attachment_id(result); if attachment && completed; record('api.sessions.get-attachment'){sessions.get_attachment(completed[:session].session_id,attachment,get_attachment_request:model('GetAttachmentRequest',results_access_key:completed[:key]))}; else skip('api.sessions.get-attachment','Redirect-session setup or result retrieval failed.'); end; if completed; record('api.sessions.redact'){sessions.redact_session(completed[:session].session_id)}; else skip('api.sessions.redact','Redirect-session setup or result retrieval failed.'); end
record('api.sessions.recommend-providers'){ sessions.recommend_providers(recommend_providers_request:model('RecommendProvidersRequest',verification_profile_id:profile,health:'All')) }
cache=ENV['SDK_COMPATIBILITY_PSO_FIXTURES_PATH']; if cache && File.file?(cache); JSON.parse(File.read(cache))['fixtures'].each{|fixture| params={'providerId'=>fixture['providerId']}; name=fixture['sdkModelName']; params['sdkModelName']=name if name; if !fixture['hasPublicSdkModel']; skip('serialization.provider-output-round-trip','Provider has no public Swagger provider-specific output model.',params); elsif !name || !TrinsicApi.const_defined?(name); skip('serialization.provider-output-round-trip','The SDK does not expose this provider-output model.',params); elsif !TrinsicApi.const_get(name).respond_to?(:build_from_hash); skip('serialization.provider-output-round-trip','The SDK does not expose a wire-JSON deserializer for this provider-output model.',params); else record('serialization.provider-output-round-trip',params){raise 'fixture omitted output' unless fixture['output']; serialized=normalize_json(TrinsicApi.const_get(name).build_from_hash(fixture['output']).to_hash); compare_json(serialized,fixture['output'],fixture['providerId'],ENV['SDK_IS_CURRENT']=='true'); }; end}; else skip('serialization.provider-output-round-trip','No shared PSO fixture cache was available.'); end
File.write(ENV.fetch('SDK_COMPATIBILITY_RESULT_FILE'),JSON.pretty_generate({'schemaVersion'=>1,'testCases'=>$results})); exit($results.any?{|c|c['status']=='failed'} ? 1 : 0)
