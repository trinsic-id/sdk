require 'json'
require 'minitest/autorun'
require 'rbconfig'

class CompatibilityTest < Minitest::Test
  API_CASES = %w[
    api.providers.list api.verification-profiles.get-by-id api.verification-profiles.list
    api.sessions.list api.redirect-uris.list api.providers.get
    api.sessions.create-hosted-provider api.sessions.create-direct-provider api.sessions.get
    api.sessions.cancel api.sessions.get-result api.sessions.get-attachment
    api.sessions.redact api.sessions.recommend-providers
  ].freeze

  def self.load_cases
    return if defined?(@cases) && @cases
    runner = File.join(__dir__, 'run_target.rb')
    system(RbConfig.ruby, runner)
    path = ENV.fetch('SDK_COMPATIBILITY_RESULT_FILE')
    raise "Compatibility runner did not write #{path}" unless File.file?(path)
    @cases = JSON.parse(File.read(path)).fetch('testCases').group_by { |test_case| test_case['id'] }
  end

  def self.cases = @cases

  def setup
    self.class.load_cases
  end

  API_CASES.each do |id|
    define_method("test_#{id.tr('.-', '_')}") do
      outcomes = self.class.cases.fetch(id)
      assert_empty outcomes.select { |outcome| outcome['status'] == 'failed' }, JSON.pretty_generate(outcomes)
    end
  end

  def test_provider_output_contract_produces_cases
    assert self.class.cases.key?('serialization.provider-output-round-trip')
  end
end
