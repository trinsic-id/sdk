require 'trinsic_api'
require 'uri'
require 'tempfile'
require 'time'

url = URI(ENV.fetch('SDK_TEST_URL'))
config = TrinsicApi::Configuration.new
config.scheme = url.scheme
config.host = "#{url.host}:#{url.port}"
config.base_path = ''
config.ignore_operation_servers = true
client = TrinsicApi::ApiClient.new(config)
# Compare exact instants, including fractional seconds and timezone offsets.
['2026-08-14T12:00:00Z', '2026-08-14T12:00:00.1Z', '2026-08-14T12:00:00.1234567Z', '2026-08-14T12:00:00.123456789+05:30'].each do |value|
  model = TrinsicApi::CzechBankIdVerification.build_from_hash('time' => value)
  raise 'Lost fractional seconds while parsing' unless model.time.to_r == Time.iso8601(value).to_r
  encoded = JSON.parse(client.object_to_http_body(model))['time']
  raise 'Lost fractional seconds while writing' unless Time.iso8601(encoded).to_r == Time.iso8601(value).to_r
end

# Connect's .github/sdk-compatibility/matrix.json waives this exact failure
# for published 3.2.0 and 3.2.1: serialization changed .472Z to whole seconds.
aadhaar = TrinsicApi::SignzyIndiaAadhaarFetchProviderOutput.build_from_hash(
  'timestamp' => '2025-06-01T15:13:54.472Z'
)
raise 'Lost Aadhaar milliseconds while parsing' unless aadhaar.timestamp.subsec == Rational(472, 1000)
aadhaar_json = JSON.parse(client.object_to_http_body(aadhaar))
raise 'Lost Aadhaar milliseconds while writing' unless aadhaar_json['timestamp'] == '2025-06-01T15:13:54.472000000Z'

api = TrinsicApi::VerificationProfilesApi.new(client)
api.create_verification_profile('alias', 'brand')
api.create_verification_profile('alias', 'brand', logo: nil, providers: nil)
api.create_verification_profile('alias', 'brand', providers: [])
api.create_verification_profile('alias', 'brand', providers: ['provider-one'])
Tempfile.create(['logo', '.png']) do |file|
  file.write('logo bytes')
  file.flush
  api.create_verification_profile('alias', 'brand', logo: file, providers: nil)
  api.create_verification_profile('alias', 'brand', logo: file, providers: ['provider-one'])
end
