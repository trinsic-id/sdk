require 'sinatra/base'
require_relative 'config'
module AdvancedRoutes
  def self.registered(app)
    app.get '/advanced' do
      send_file File.join(settings.public_folder, 'advanced.html')
    end

  end
end