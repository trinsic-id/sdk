require 'sinatra/base'
require_relative 'config'
module WidgetRoutes
  def self.registered(app)
    app.get '/widget' do
      send_file File.join(settings.public_folder, 'widget.html')
    end

    app.post '/create-widget-session' do
      redirectUrl = params[:redirectUrl]
      verificationProfileId = ENV['TRINSIC_VERIFICATION_PROFILE_ID']
      req = TrinsicApi::CreateWidgetSessionRequest.new({
        redirect_url: redirectUrl,
        verification_profile_id: verificationProfileId
      })

      result = TrinsicServices::SESSIONS.create_widget_session({
        create_widget_session_request: req
      })
      json result.to_body
    end

  end
end