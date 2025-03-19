require 'sinatra/base'
require_relative 'config'
module HostedRoutes
  def self.registered(app)
    app.get '/hosted' do
      send_file File.join(settings.public_folder, 'hosted.html')
    end

    app.get '/hosted-launch/:provider' do
      provider = params[:provider]
      redirectUrl = params[:redirectUrl]
      req = TrinsicApi::CreateHostedProviderSessionRequest.new({
        redirect_url: redirectUrl,
        provider: provider
      })

      opts = {
        create_hosted_provider_session_request: req
      }
      result = TrinsicServices::SESSIONS.create_hosted_provider_session(opts)
      redirect result.launch_url
    end
  end
end