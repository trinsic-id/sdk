require 'json'; require 'tmpdir'; require 'fileutils'; require 'time'
root=File.expand_path('../..',__dir__); config=%w[TRINSIC_TEST_BASE_URL TRINSIC_TEST_ACCESS_TOKEN TRINSIC_TEST_VERIFICATION_PROFILE_ID].to_h{|k|[k,ENV.fetch(k)]}; versions=JSON.parse(File.read("#{root}/compatibility.json")).dig('compatibility','sdkVersions','ruby'); targets=[['current branch',ENV['SDK_RUBY_CURRENT_PACKAGE'],true], ["origin/main (#{ENV['SDK_ORIGIN_MAIN_REVISION']})",ENV['SDK_RUBY_MAIN_PACKAGE'],true]]+versions.reverse.map{|v|["trinsic_api@#{v}",v,false]}; results=[]
def api_coverage(catalog)
  spec_path=ENV['SDK_COMPATIBILITY_OPENAPI_SPEC']
  return nil unless spec_path && File.file?(spec_path)
  spec=JSON.parse(File.read(spec_path)); raise "OpenAPI specification at #{spec_path} has no paths object." unless spec['paths'].is_a?(Hash)
  case_map=Hash.new{|hash,key|hash[key]=[]}; catalog.each{|test_case| case_map[test_case['operationId']] << test_case['id'] if test_case['kind']=='api-operation' && test_case['operationId'].is_a?(String)}
  operation_ids=[]; operations=[]
  spec['paths'].each do |path,item|
    next unless item.is_a?(Hash)
    item.each do |method,operation|
      next unless %w[delete get head options patch post put].include?(method.downcase) && operation.is_a?(Hash) && operation['operationId'].is_a?(String)
      operation_id=operation['operationId']; operation_ids << operation_id; test_case_ids=case_map[operation_id]
      operations << {'covered'=>!test_case_ids.empty?,'method'=>method.upcase,'operationId'=>operation_id,'path'=>path,'testCaseIds'=>test_case_ids}
    end
  end
  operations.sort_by!{|operation|[operation['path'],operation['method']]}
  {'covered'=>operations.count{|operation|operation['covered']},'total'=>operations.length,'operations'=>operations,'unmappedTestCaseIds'=>catalog.filter{|test_case|test_case['kind']=='api-operation' && !operation_ids.include?(test_case['operationId'])}.map{|test_case|test_case['id']}}
end
targets.each do |label,source,current|
  Dir.mktmpdir('trinsic-ruby-compat-') do |dir|
    output=File.join(dir,'result.json'); result={'label'=>label,'isCurrent'=>current,'testCases'=>[]}; gemline=File.directory?(source) ? "gem 'trinsic_api', path: #{source.dump}" : "gem 'trinsic_api', #{source.dump}"; File.write("#{dir}/Gemfile", "source 'https://rubygems.org'\n#{gemline}\n")
    environment=config.merge('BUNDLE_GEMFILE'=>"#{dir}/Gemfile",'SDK_COMPATIBILITY_RESULT_FILE'=>output,'SDK_IS_CURRENT'=>current.to_s,'SDK_TARGET_LABEL'=>label)
    installed=system(environment,'bundle','install','--quiet')
    ran=installed && system(environment,'bundle','exec','ruby',File.join(__dir__,'run_target.rb'))
    result['testCases']=File.file?(output) ? JSON.parse(File.read(output))['testCases'] : [{'id'=>'framework.ruby-runner','status'=>'failed','durationMs'=>0,'failure'=>{'name'=>'TestRunnerError','message'=> installed ? 'Ruby target exited before producing structured results.' : 'Bundler could not install this Ruby SDK target.'}}]; result['sdkVersion']=source unless File.directory?(source); results<<result
  end
end
catalog=JSON.parse(File.read("#{root}/compatibility-tests.json"))['testCases']; report={'$schema'=>'https://trinsic.id/schemas/sdk-compatibility-results-v1.json','schemaVersion'=>1,'run'=>{'generatedAt'=>Time.now.utc.iso8601,'targetBaseUrl'=>config['TRINSIC_TEST_BASE_URL']},'suite'=>{'language'=>'ruby'},'testCatalog'=>catalog,'targets'=>results}; coverage=api_coverage(catalog); report['apiCoverage']=coverage if coverage; output=ENV.fetch('SDK_COMPATIBILITY_RESULTS_PATH',"#{__dir__}/.results/compatibility.json"); FileUtils.mkdir_p(File.dirname(output)); File.write(output,JSON.pretty_generate(report)); exit(results.flatten.any?{|r|r['testCases'].any?{|c|c['status']=='failed'}} ? 1 : 0)
