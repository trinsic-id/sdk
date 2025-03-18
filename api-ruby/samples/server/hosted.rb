require 'sinatra/base'
require_relative 'config'
module HostedRoutes
  def self.registered(app)
    app.get '/hosted' do
      send_file File.join(settings.public_folder, 'hosted.html')
    end
  end
end