require 'sinatra/base'
require_relative 'config'
module WidgetRoutes
  def self.registered(app)
    app.get '/widget' do
      send_file File.join(settings.public_folder, 'widget.html')
    end

    app.post '/create-session' do
      redirectUrl = params[:redirectUrl]
      req = TrinsicApi::CreateWidgetSessionRequest.new
      req.redirect_url = redirectUrl

      opts = {
        create_widget_session_request: req
      }
      puts opts
      result = TrinsicServices::SESSIONS.create_widget_session(opts)
      json result.to_body
    end

  end
end