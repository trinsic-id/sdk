Gem::Specification.new do |spec|
  spec.name          = 'trinsic-service-results'
  spec.version       = '1.0.0'
  spec.authors       = ['Trinsic ID']
  spec.email         = ['support@trinsic.id']

  spec.summary       = 'ServiceResults project for standardized result handling in Trinsic SDK'
  spec.description   = 'This gem provides standardized result handling and exchange functionality for the Trinsic SDK across Ruby applications.'
  spec.homepage      = 'https://github.com/trinsic-id/sdk'
  spec.license       = 'MIT'

  spec.required_ruby_version = '>= 2.7.0'

  spec.metadata['homepage_uri'] = spec.homepage
  spec.metadata['source_code_uri'] = 'https://github.com/trinsic-id/sdk'
  spec.metadata['changelog_uri'] = 'https://github.com/trinsic-id/sdk/blob/main/CHANGELOG.md'
  spec.metadata['documentation_uri'] = 'https://docs.trinsic.id'
  spec.metadata['bug_tracker_uri'] = 'https://github.com/trinsic-id/sdk/issues'

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files = Dir.glob(['*.rb', 'README.md'])
  spec.bindir        = 'exe'
  spec.executables   = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ['.']

  # Runtime dependencies
  # (none required for this implementation)

  # Development dependencies
  spec.add_development_dependency 'rspec', '~> 3.12'
  spec.add_development_dependency 'rubocop', '~> 1.50'
  spec.add_development_dependency 'yard', '~> 0.9'
  spec.add_development_dependency 'rake', '~> 13.0'
end