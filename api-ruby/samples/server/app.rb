require 'dotenv/load'
require 'httparty'
require 'json'
require 'sinatra/base'
require 'sinatra/json'
require 'trinsic_api'
require_relative 'shared'
require_relative 'widget'
require_relative 'hosted'
require_relative 'advanced'


class MyApp < Sinatra::Base
  set :port, 3000

  # Set the public folder to serve static assets
  set :public_folder, File.expand_path('../../../../ui-web/samples/dist', __FILE__)

  get '/' do
    send_file File.join(settings.public_folder, 'index.html')
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

  
  register SharedRoutes
  register WidgetRoutes
  register HostedRoutes
  register AdvancedRoutes

  # Start the server if this file is executed directly
  run! if app_file == $0
end
