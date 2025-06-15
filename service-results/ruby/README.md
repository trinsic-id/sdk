# ServiceResults Ruby Implementation

This directory contains the Ruby implementation of the ServiceResults project for use with the Trinsic Ruby SDK.

## Files

- `exchange_result_request.rb` - Standard request model with validation
- `result_exchanger.rb` - Service class for exchanging result access keys  
- `result_processor.rb` - Utility class for processing and validating results
- `service_results.rb` - Main module file with convenience methods
- `trinsic-service-results.gemspec` - Gem specification

## Requirements

- Ruby 2.7 or higher
- Trinsic Ruby SDK

## Installation

### Via Bundler

Add this line to your application's Gemfile:

```ruby
gem 'trinsic-service-results'
```

And then execute:

```bash
bundle install
```

### Via gem

```bash
gem install trinsic-service-results
```

## Usage

### Basic Integration

```ruby
require 'trinsic/service_results'

# Initialize with your sessions API
sessions_api = YourSessionsApiImplementation.new
exchanger = Trinsic::ServiceResults::ResultExchanger.new(sessions_api)

# Handle request
begin
  request = Trinsic::ServiceResults::ExchangeResultRequest.from_hash({
    sessionId: '550e8400-e29b-41d4-a716-446655440000',
    resultsAccessKey: 'rak_test123456'
  })
  
  result = exchanger.exchange_result(request)
  puts "Exchange successful: #{result}"
  
rescue Trinsic::ServiceResults::ValidationError => e
  puts "Validation error: #{e.message}"
rescue StandardError => e
  puts "Exchange failed: #{e.message}"
end
```

### Framework Integration Examples

#### Sinatra

```ruby
require 'sinatra'
require 'json'
require 'trinsic/service_results'

# Initialize exchanger
sessions_api = YourSessionsApiImplementation.new
exchanger = Trinsic::ServiceResults::ResultExchanger.new(sessions_api)

post '/exchange-result' do
  content_type :json
  
  begin
    data = JSON.parse(request.body.read, symbolize_names: true)
    exchange_request = Trinsic::ServiceResults::ExchangeResultRequest.from_hash(data)
    result = exchanger.exchange_result(exchange_request)
    
    result.to_json
  rescue Trinsic::ServiceResults::ValidationError => e
    status 400
    { error: e.message }.to_json
  rescue StandardError => e
    status 500
    { error: 'Internal server error' }.to_json
  end
end
```

#### Rails

```ruby
# app/controllers/results_controller.rb
class ResultsController < ApplicationController
  before_action :initialize_exchanger

  def exchange
    exchange_request = Trinsic::ServiceResults::ExchangeResultRequest.from_hash(params.permit(:sessionId, :resultsAccessKey))
    result = @exchanger.exchange_result(exchange_request)
    
    render json: result
  rescue Trinsic::ServiceResults::ValidationError => e
    render json: { error: e.message }, status: :bad_request
  rescue StandardError => e
    render json: { error: 'Internal server error' }, status: :internal_server_error
  end

  private

  def initialize_exchanger
    sessions_api = YourSessionsApiImplementation.new
    @exchanger = Trinsic::ServiceResults::ResultExchanger.new(sessions_api)
  end
end
```

#### Roda

```ruby
require 'roda'
require 'json'
require 'trinsic/service_results'

class App < Roda
  route do |r|
    # Initialize exchanger
    sessions_api = YourSessionsApiImplementation.new
    exchanger = Trinsic::ServiceResults::ResultExchanger.new(sessions_api)

    r.post 'exchange-result' do
      begin
        data = JSON.parse(request.body.read, symbolize_names: true)
        exchange_request = Trinsic::ServiceResults::ExchangeResultRequest.from_hash(data)
        result = exchanger.exchange_result(exchange_request)
        
        response['Content-Type'] = 'application/json'
        result.to_json
      rescue Trinsic::ServiceResults::ValidationError => e
        response.status = 400
        { error: e.message }.to_json
      rescue StandardError => e
        response.status = 500
        { error: 'Internal server error' }.to_json
      end
    end
  end
end
```

### Concurrent Processing

```ruby
# Process multiple results concurrently
requests = [
  Trinsic::ServiceResults::ExchangeResultRequest.new('session1', 'key1'),
  Trinsic::ServiceResults::ExchangeResultRequest.new('session2', 'key2'),
  Trinsic::ServiceResults::ExchangeResultRequest.new('session3', 'key3')
]

result = exchanger.exchange_multiple_results_concurrent(requests, max_threads: 3)

result[:results].each_with_index do |res, index|
  if result[:errors][index]
    puts "Request #{index} failed: #{result[:errors][index]}"
  else
    puts "Request #{index} succeeded: #{res}"
  end
end
```

### Processing Results

```ruby
# Process session result
processed = Trinsic::ServiceResults::ResultProcessor.process_session_result(session_result)

puts "Session ID: #{processed.session_id}"
puts "State: #{processed.state}"
puts "Has verifications: #{processed.has_verifications}"
puts "Result count: #{processed.result_count}"
```

### Features

- **Request Validation**: Built-in validation with meaningful error messages
- **Error Handling**: Custom exception types for different error scenarios
- **Result Processing**: Utility methods for common result operations
- **Concurrent Processing**: Thread-based concurrent processing support
- **Retry Logic**: Built-in retry support for transient failures
- **Logging Support**: Built-in request sanitization for secure logging

### Testing

Example RSpec test:

```ruby
RSpec.describe Trinsic::ServiceResults::ExchangeResultRequest do
  describe '#validate!' do
    it 'does not raise with valid data' do
      request = described_class.new(
        '550e8400-e29b-41d4-a716-446655440000',
        'rak_test123456'
      )
      
      expect { request.validate! }.not_to raise_error
    end

    it 'raises ValidationError with invalid UUID' do
      expect {
        described_class.new('invalid-uuid', 'rak_test123456')
      }.to raise_error(Trinsic::ServiceResults::ValidationError, /valid UUID/)
    end
  end
end

RSpec.describe Trinsic::ServiceResults::ResultExchanger do
  let(:sessions_api) { instance_double('SessionsApi') }
  let(:exchanger) { described_class.new(sessions_api) }
  let(:request) { Trinsic::ServiceResults::ExchangeResultRequest.new('550e8400-e29b-41d4-a716-446655440000', 'rak_test') }

  describe '#exchange_result' do
    it 'returns result from sessions API' do
      expected_result = { 'mock' => 'result' }
      allow(sessions_api).to receive(:get_session_result).and_return(expected_result)
      
      result = exchanger.exchange_result(request)
      
      expect(result).to eq(expected_result)
    end
  end
end
```

### Development

```bash
# Install dependencies
bundle install

# Run tests
bundle exec rspec

# Run RuboCop (linter)
bundle exec rubocop

# Generate documentation
bundle exec yard doc

# Build gem
gem build trinsic-service-results.gemspec
```