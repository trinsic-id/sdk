require 'json'
require 'trinsic_api'

request = TrinsicApi::GetSessionResultRequest.new(
  results_access_key: 'results-key', redirect_token: 'redirect-token'
)
expected = { 'resultsAccessKey' => 'results-key', 'redirectToken' => 'redirect-token' }
raise 'Named fields were rebound' unless JSON.parse(JSON.generate(request.to_hash)) == expected
decoded = TrinsicApi::GetSessionResultRequest.build_from_hash(expected)
raise 'Named fields did not round-trip' unless decoded == request

[['results-key'], ['results-key', 'redirect-token']].each do |args|
  begin
    TrinsicApi::GetSessionResultRequest.new(*args)
  rescue ArgumentError => error
    raise unless error.message.match?(/must be a hash|wrong number of arguments/)
  else
    raise "Positional model construction accepted: #{args.inspect}"
  end
end

# Models accept one attributes hash; individual fields must never become arguments.
models = TrinsicApi.constants.filter_map do |name|
  model = TrinsicApi.const_get(name)
  model if model.is_a?(Class) && model < TrinsicApi::ApiModelBase
end
raise 'No generated models were inspected' if models.empty?
models.each do |model|
  unless model.instance_method(:initialize).parameters == [[:opt, :attributes]]
    raise "Positional model fields: #{model}"
  end
end
puts "Attribute hash construction and JSON behavior passed for #{models.length} model signatures"
