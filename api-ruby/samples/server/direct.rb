require 'sinatra/base'
require_relative 'config'
module DirectRoutes
  def self.registered(app)
    app.get '/direct' do
      send_file File.join(settings.public_folder, 'direct.html')
    end

    app.get '/direct-popup' do
      send_file File.join(settings.public_folder, 'direct-popup.html')
    end

    app.post('/create-direct-session/:provider') do
      provider = params[:provider]
      redirectUrl = params[:redirectUrl]
      fallbackToTrinsicUI = params[:fallbackToTrinsicUI] == "true"
      capabilities = params[:capabilities].split(",")
      verificationProfileId = ENV['TRINSIC_VERIFICATION_PROFILE_ID']

      req = TrinsicApi::CreateDirectProviderSessionRequest.new({
        redirect_url: redirectUrl,
        provider: provider,
        capabilities: capabilities,
        fallback_to_hosted_ui: fallbackToTrinsicUI,
        verification_profile_id: verificationProfileId
      })

      opts = {
        create_direct_provider_session_request: req
      }

      result = TrinsicServices::SESSIONS.create_direct_provider_session(opts)
      json result.to_body
    end

    app.post('/refresh-content/:sessionId') do
      sessionId = params[:sessionId]
      request_payload = JSON.parse(request.body.read)
      results_access_key = request_payload["resultsAccessKey"]

      result = TrinsicServices::SESSIONS.refresh_step_content(sessionId, {
        refresh_step_content_request: TrinsicApi::RefreshStepContentRequest.new({
          results_access_key: results_access_key
        })
      })
      json DirectRoutes.deep_transform(result.to_body)
    end

    app.post('/poll-results/:sessionId') do
      request_payload = JSON.parse(request.body.read)
      # Accessing a specific parameter
      results_access_key = request_payload["resultsAccessKey"]

      result = TrinsicServices::SESSIONS.get_session_result(params[:sessionId], {
        get_session_result_request: TrinsicApi::GetSessionResultRequest.new({
          results_access_key: results_access_key
        })
      })

      json DirectRoutes.deep_transform(result.to_body)
    end

  end

  # We want to deeply transform as all Time values should be changed to iso8601 to be compatible with our web ui SDK
  def self.deep_transform(obj)
    case obj
    when Hash
      obj.transform_values { |v| deep_transform(v) }
    when Array
      obj.map { |v| deep_transform(v) }
    when Time
      obj.iso8601
    else
      obj
    end
  end

end