require 'trinsic_api'

# A value added to the API after this SDK was generated must not fail the response.
step = TrinsicApi::IntegrationStep.build_from_hash('method' => 'FutureLaunchMethod', 'content' => 'content')
unless step.method == TrinsicApi::IntegrationLaunchMethod::UNKNOWN_DEFAULT_OPEN_API && step.content == 'content'
  raise 'Required enum did not fall back'
end
session = TrinsicApi::Session.build_from_hash(
  'id' => 'session-id', 'done' => true, 'success' => false, 'errorCode' => 'FutureErrorCode', 'created' => 1, 'updated' => 2
)
unless session.error_code == TrinsicApi::SessionErrorCode::UNKNOWN_DEFAULT_OPEN_API && session.id == 'session-id'
  raise 'Nullable enum did not fall back'
end
request = TrinsicApi::CreateDirectProviderSessionRequest.build_from_hash(
  'provider' => 'provider', 'verificationProfileId' => '00000000-0000-0000-0000-000000000001',
  'capabilities' => %w[LaunchBrowser FutureCapability], 'enableRedirectBackwardsCompatibility' => false
)
unless request.capabilities == [TrinsicApi::IntegrationCapability::LAUNCH_BROWSER, TrinsicApi::IntegrationCapability::UNKNOWN_DEFAULT_OPEN_API]
  raise 'Enum list did not fall back'
end

# Known values, including a real member named Unknown, and nulls are unchanged.
raise 'Known value was replaced' unless TrinsicApi::PersonData.build_from_hash('sex' => 'Unknown').sex == TrinsicApi::Sex::UNKNOWN
raise 'Null became a value' unless TrinsicApi::PersonData.build_from_hash('sex' => nil).sex.nil?
unless TrinsicApi::IntegrationStep.new(method: TrinsicApi::IntegrationLaunchMethod::LAUNCH_BROWSER, content: 'content').to_hash[:method] == 'LaunchBrowser'
  raise 'Enum serialization changed'
end

# Every generated enum must fall back.
enums = TrinsicApi.constants.filter_map do |name|
  enum = TrinsicApi.const_get(name)
  enum if enum.is_a?(Class) && enum.respond_to?(:all_vars)
end
raise 'No generated enums were inspected' if enums.empty?
enums.each do |enum|
  unless enum.build_from_hash('FutureValue') == enum::UNKNOWN_DEFAULT_OPEN_API
    raise "Unknown value rejected: #{enum}"
  end
end
puts "Unknown enum values fell back for #{enums.length} enums"
