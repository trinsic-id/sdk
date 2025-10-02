require 'dotenv/load'
require 'httparty'
require 'json'
require 'sinatra/base'
require 'sinatra/json'
require 'trinsic_api'
require_relative 'shared'
require_relative 'widget'
require_relative 'hosted'
require_relative 'direct'


class MyApp < Sinatra::Base
  set :port, 3000

  # Set the public folder to serve static assets
  set :public_folder, File.expand_path('../../../../ui-web/samples/dist', __FILE__)

  # Disable Sinatra’s default error page in development to use custom error handlers
  configure :development do
    set :show_exceptions, false
  end

  register SharedRoutes
  register WidgetRoutes
  register HostedRoutes
  register DirectRoutes

  # Custom error handler for unhandled exceptions
  error do
    e = env['sinatra.error']
    logger.error "Unhandled exception: #{e.class} - #{e.message}"
    logger.error e.backtrace.join("\n")

    status 500
    content_type :json
    {
      message: "Request failed: check the logs on the backend for more information. #{e.message}"
    }.to_json
  end

  # Start the server if this file is executed directly
  run! if app_file == $0
end
