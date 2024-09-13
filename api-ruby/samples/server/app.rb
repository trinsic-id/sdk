require 'dotenv/load'
require 'httparty'
require 'json'
require 'sinatra/base'
require 'sinatra/json'
require 'trinsic_api'

class MyApp < Sinatra::Base
  set :port, 3000

  TrinsicApi.configure do |config|
    config.access_token = ENV['TRINSIC_ACCESS_TOKEN']
  end

  network = TrinsicApi::NetworkApi.new
  sessions = TrinsicApi::SessionsApi.new

  # Set the public folder to serve static assets
  set :public_folder, File.expand_path('../../../../ui-web/samples/dist', __FILE__)

  # Serve static files from the custom directory
  get '/' do
    send_file File.join(settings.public_folder, 'index.html')
  end

  get '/redirect' do
    send_file File.join(settings.public_folder, 'redirect.html')
  end

  get '/providers' do
    result = network.list_providers
    json result.to_body
  end

  get '/launch/:provider' do
    provider = params['provider']

    req = TrinsicApi::CreateSessionRequest.new
    req.launch_provider_directly = true
    req.providers = [provider]

    opts = {
      create_session_request: req
    }

    result = sessions.create_session(opts)
    # redirect to result.url
    redirect result.launch_url + "&redirectUrl=" + params['redirectUrl']
  end

  post '/create-session' do
    req = TrinsicApi::CreateSessionRequest.new
    opts = {
      create_session_request: req
    }

    result = sessions.create_session(opts)
    json result.to_body
  end

  post '/exchange-result' do
    body = JSON.parse(request.body.read)

    session_id = body['sessionId']
    access_key = body['resultsAccessKey']

    opts = {
      get_session_result_request: TrinsicApi::GetSessionResultRequest.new({
        results_access_key: access_key 
      })
    }

    result = sessions.get_session_result(session_id, opts)
    json result.to_body
  end

  # Start the server if this file is executed directly
  run! if app_file == $0
end
