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

  register SharedRoutes
  register WidgetRoutes
  register HostedRoutes
  register AdvancedRoutes

  # Start the server if this file is executed directly
  run! if app_file == $0
end
