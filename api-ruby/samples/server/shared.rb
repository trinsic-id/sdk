require 'sinatra/base'
require_relative 'config'
module SharedRoutes
  def self.registered(app)

    app.get '/' do
      send_file File.join(settings.public_folder, 'index.html')
    end  
    
    app.get '/redirect' do
      send_file File.join(settings.public_folder, 'redirect.html')
    end

    app.get '/providers' do
      ipAddress = params[:ipAddress]
      info_args = {}
      info_args[:ip_addresses] = [ipAddress] if ipAddress
      req = TrinsicApi::RecommendRequest.new({
        recommendation_info: info_args
      })

      result = TrinsicServices::NETWORK.recommend_providers({recommend_request: req})
      json result.to_body
    end

    app.post '/exchange-result' do
      body = JSON.parse(request.body.read)
  
      session_id = body['sessionId']
      access_key = body['resultsAccessKey']
  
      opts = {
        get_session_result_request: TrinsicApi::GetSessionResultRequest.new({
          results_access_key: access_key 
        })
      }
  
      result = TrinsicServices::SESSIONS.get_session_result(session_id, opts)
      json result.to_body
    end

  end
end