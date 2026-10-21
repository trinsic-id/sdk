require 'json'; require 'net/http'; require 'time'; require 'trinsic_api'; require 'uri'
$compatibility_results = []
def record(id, params = {})
  started = Process.clock_gettime(Process::CLOCK_MONOTONIC); value = yield
  $compatibility_results << { 'id' => id, 'status' => 'passed', 'durationMs' => ((Process.clock_gettime(Process::CLOCK_MONOTONIC) - started) * 1000).to_i, 'parameters' => params }; value
rescue StandardError => error
  $compatibility_results << { 'id' => id, 'status' => 'failed', 'durationMs' => ((Process.clock_gettime(Process::CLOCK_MONOTONIC) - started) * 1000).to_i, 'parameters' => params, 'failure' => { 'name' => error.class.name, 'message' => error.message } }; nil
end
def record_skip(id, reason, params = {}) = $compatibility_results << { 'id' => id, 'status' => 'skipped', 'durationMs' => 0, 'parameters' => params, 'skipReason' => reason }
def write_results = File.write(ENV.fetch('SDK_COMPATIBILITY_RESULT_FILE'), JSON.pretty_generate({ 'schemaVersion' => 1, 'testCases' => $compatibility_results }) + "\n")
def model(name, attributes) = TrinsicApi.const_get(name).new(attributes)
def as_hash(value) = value.respond_to?(:to_hash) ? value.to_hash : value
def response_body(value) = value.is_a?(Array) && value.length == 3 && value.last.is_a?(Hash) ? value[0] : value
def normalize_json(value) = JSON.parse(JSON.generate(value))
def supports_attribute?(model_name, attribute) = TrinsicApi.const_get(model_name).attribute_map.key?(attribute)
def allow_missing_pso_models? = %w[1 true].include?(ENV.fetch('SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS', '').downcase)
def equivalent_timestamp?(actual, expected); actual.match?(/^\d{4}-\d{2}-\d{2}[ T]/) && expected.match?(/^\d{4}-\d{2}-\d{2}[ T]/) && Time.parse(actual).utc.to_i == Time.parse(expected).utc.to_i; rescue StandardError; false; end
def compare_json(actual, expected, path, exact)
  if actual.is_a?(Hash) && expected.is_a?(Hash)
    actual.each { |key, value| compare_json(value, expected[key], "#{path}.#{key}", exact) if expected.key?(key) }; raise "#{path}: SDK omitted fixture fields: #{expected.keys - actual.keys}." if exact && !(expected.keys - actual.keys).empty?
  elsif actual.is_a?(Array) && expected.is_a?(Array)
    raise "#{path}: array lengths differ." if exact && actual.length != expected.length; actual.each_with_index { |value, index| raise "#{path}[#{index}]: SDK emitted an array value absent from fixture." if index >= expected.length; compare_json(value, expected[index], "#{path}[#{index}]", exact) }
  elsif actual != expected && !(actual.is_a?(String) && expected.is_a?(String) && equivalent_timestamp?(actual, expected))
    raise "#{path}: values differ; SDK=#{actual.inspect}, wire=#{expected.inspect}."
  end
end
def find_http(value); return value if value.is_a?(String) && value.match?(%r{^https?://}); return value.values.lazy.map { |item| find_http(item) }.find(&:itself) if value.is_a?(Hash); return value.lazy.map { |item| find_http(item) }.find(&:itself) if value.is_a?(Array); end
class BrowserSession
  def initialize = @cookies = []
  def fetch(url)
    uri = URI(url); request = Net::HTTP::Get.new(uri); request['Cookie'] = @cookies.join('; ') unless @cookies.empty?; response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') { |http| http.request(request) }; @cookies = response.get_fields('set-cookie').to_a.map { |cookie| cookie.split(';', 2).first } unless response.get_fields('set-cookie').to_a.empty?; [response.code.to_i, response['location'], url]
  end
end
def completed_redirect_session(session)
  browser = BrowserSession.new; status, location, source = browser.fetch(session.next_step.content); raise 'Direct session launch did not redirect to the test integration.' unless status == 302 && location; integration = URI.join(source, location); callback = URI(URI.decode_www_form(integration.query.to_s).to_h.fetch('redirectUrl')); query = URI.decode_www_form(callback.query.to_s).to_h; query['resultState'] = 'success'; callback.query = URI.encode_www_form(query); _, location, source = browser.fetch(callback.to_s); raise 'Test integration callback did not redirect.' unless location; _, location, source = browser.fetch(URI.join(source, location).to_s); raise 'Verification completion did not redirect.' unless location; _, location, source = browser.fetch(URI.join(source, location).to_s); raise 'Redirect completion did not redirect.' unless location; application = URI.join(source, location); [URI.decode_www_form(application.query.to_s).to_h.fetch('redirectToken'), session.result_collection.results_access_key]
end
def attachment_id(result) = result&.identity_data&.attachments&.first&.id
