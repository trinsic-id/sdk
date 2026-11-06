require 'json'; require 'net/http'; require 'time'; require 'trinsic_api'; require 'uri'; require 'base64'
$compatibility_results = []

module RecordedCompatibilityFailure
  # Minitest counts exact Assertion classes in its summary.
  def self.new(message) = Minitest::Assertion.new(message).extend(self)
end
class CompatibilityReporter < Minitest::AbstractReporter
  attr_reader :failures, :complete
  def initialize = @failures = []
  def record(result)
    result.failures.each_with_index do |error, index|
      next if error.is_a?(Minitest::Skip)
      name = error.is_a?(RecordedCompatibilityFailure) ? 'compatibility' : "#{result.klass}.#{result.name}:#{index}"
      @failures << { 'name' => name, 'message' => error.message }
    end
  end
  def report = @complete = true
end
Minitest.extensions << 'compatibility'
def Minitest.plugin_compatibility_init(_options)
  $compatibility_reporter = CompatibilityReporter.new
  reporter << $compatibility_reporter
end
def configure_base_url(config, base_url)
  uri = URI(base_url)
  raise 'TRINSIC_TEST_BASE_URL must be an absolute HTTP(S) URL.' unless uri.is_a?(URI::HTTP) && uri.host
  config.scheme = uri.scheme
  config.host = uri.host + (uri.port == uri.default_port ? '' : ":#{uri.port}")
  config.base_path = uri.path
  config.server_index = nil
end
def record(id, params = {})
  started = Process.clock_gettime(Process::CLOCK_MONOTONIC); value = yield
  $compatibility_results << { 'id' => id, 'status' => 'passed', 'durationMs' => ((Process.clock_gettime(Process::CLOCK_MONOTONIC) - started) * 1000).to_i, 'parameters' => params }; value
rescue StandardError => error
  $compatibility_results << { 'id' => id, 'status' => 'failed', 'nativeTest' => 'compatibility', 'durationMs' => ((Process.clock_gettime(Process::CLOCK_MONOTONIC) - started) * 1000).to_i, 'parameters' => params, 'failure' => { 'name' => error.class.name, 'message' => error.message } }; nil
end
def record_skip(id, reason, params = {}) = $compatibility_results << { 'id' => id, 'status' => 'skipped', 'durationMs' => 0, 'parameters' => params, 'skipReason' => reason }
def write_results = File.write(ENV.fetch('SDK_COMPATIBILITY_RESULT_FILE'), JSON.pretty_generate({ 'schemaVersion' => 1, 'testCases' => $compatibility_results, 'nativeFailures' => $compatibility_reporter&.complete ? $compatibility_reporter.failures : nil }) + "\n")
def model(name, attributes) = TrinsicApi.const_get(name).new(attributes)
def as_hash(value) = value.respond_to?(:to_hash) ? value.to_hash : value
def response_body(value) = value.is_a?(Array) && value.length == 3 && value.last.is_a?(Hash) ? value[0] : value
def normalize_json(value) = JSON.parse(JSON.generate(value))
def equivalent_timestamp?(actual, expected); actual.match?(/^\d{4}-\d{2}-\d{2}[ T]/) && expected.match?(/^\d{4}-\d{2}-\d{2}[ T]/) && Time.parse(actual).utc == Time.parse(expected).utc; rescue StandardError; false; end

def model_fields(model, wire, decoded = false)
  if wire.is_a?(Hash) && model.class.respond_to?(:attribute_map)
    model.class.attribute_map.each_with_object({}) do |(attribute, key), output|
      key = key.to_s
      output[key] = model_fields(model.public_send(attribute), wire[key], decoded) if wire.key?(key)
    end
  elsif wire.is_a?(Array) && model.is_a?(Array)
    raise 'SDK changed array length' unless model.length == wire.length
    wire.each_with_index.map { |item, index| model_fields(model[index], item, decoded) }
  elsif wire.is_a?(Hash) && model.is_a?(Hash)
    raise 'SDK changed dictionary keys' if decoded && model.keys.map(&:to_s).sort != wire.keys.sort
    wire.to_h { |key, value| [key, model_fields(model.key?(key) ? model[key] : model[key.to_sym], value, decoded)] }
  else
    decoded ? (model.is_a?(Time) ? model.iso8601(9) : normalize_json(model)) : wire
  end
end

class CapturingClient < TrinsicApi::ApiClient
  attr_reader :last_request
  def build_request(*args)
    request = super
    @last_request = request
    request.on_complete { |response| @wire = response.body.empty? ? nil : JSON.parse(response.body) }
    request
  end
  def call_api(*args)
    result = super
    compare_json(model_fields(result[0], @wire, true), model_fields(result[0], @wire), 'response', true) unless result[0].nil?
    result
  end
end

def assert_session(response, id, done, success)
  session = response.session
  raise 'Session ID differs' unless session.id.to_s.downcase == id.to_s.downcase
  raise 'Session state differs' unless session.done == done && session.success == success
end
def assert_attachment(response)
  raise 'Attachment must contain PNG bytes' unless response.content_type == 'image/png' && Base64.strict_decode64(response.content).start_with?("\x89PNG\r\n\x1a\n".b)
end
def assert_page(response, field)
  raise 'Invalid page' unless response.public_send(field).is_a?(Array) && [true, false].include?(response.more)
  response.public_send(field).each { |item| raise 'Page entry omitted ID' if item.id.to_s.empty? }
end
def assert_created(session, hosted = false)
  raise 'Invalid session ID' unless session.session_id.match?(/\A[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\z/i)
  url = hosted ? session.launch_url : session.next_step.content
  raise 'Invalid launch URL' unless URI(url).is_a?(URI::HTTP) && URI(url).host
  key = hosted ? session.results_access_key : session.result_collection.results_access_key
  raise 'Missing results key' if key.to_s.empty?
  raise 'Invalid direct flow' unless hosted || (session.next_step.method == 'LaunchBrowser' && session.result_collection.method == 'CaptureRedirect')
  session
end
def assert_request(client, expected)
  sent = JSON.parse(client.last_request.options.fetch(:body))
  expected.each { |key, value| compare_json(sent.fetch(key), value, "request.#{key}", true) }
end
def compare_json(actual, expected, path, exact)
  if actual.is_a?(Hash) && expected.is_a?(Hash)
    actual.each { |key, value| compare_json(value, expected[key], "#{path}.#{key}", exact) if expected.key?(key) }; raise "#{path}: SDK omitted fixture fields: #{expected.keys - actual.keys}." if exact && !(expected.keys - actual.keys).empty?
  elsif actual.is_a?(Array) && expected.is_a?(Array)
    raise "#{path}: array lengths differ." if actual.length != expected.length; actual.each_with_index { |value, index| compare_json(value, expected[index], "#{path}[#{index}]", exact) }
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
