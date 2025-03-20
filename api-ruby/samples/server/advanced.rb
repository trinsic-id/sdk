require 'sinatra/base'
require_relative 'config'
module AdvancedRoutes
  def self.registered(app)
    app.get '/advanced' do
      send_file File.join(settings.public_folder, 'advanced.html')
    end

    app.get '/advanced-popup' do
      send_file File.join(settings.public_folder, 'advanced-popup.html')
    end

    app.get('/advanced-launch/:provider') do
      begin
        provider = params[:provider]
        redirectUrl = params[:redirectUrl]
        fallbackToTrinsicUI = params[:fallbackToTrinsicUI] == "true"
        capabilities = params[:capabilities].split(",")

        req = TrinsicApi::CreateAdvancedProviderSessionRequest.new({
          redirect_url: redirectUrl,
          provider: provider,
          capabilities: capabilities,
          fallback_to_hosted_ui: fallbackToTrinsicUI
        })

        opts = {
          create_advanced_provider_session_request: req
        }

        result = TrinsicServices::SESSIONS.create_advanced_provider_session(opts)

        if result.next_step.method == 'LaunchBrowser'
          redirect result.next_step.content
        else
          should_refresh = !result.next_step.refresh.nil?
          refresh_after = should_refresh ? result.next_step.refresh.refresh_after.iso8601 : Time.now.utc.iso8601
          query_params = {
            sessionId: result.session_id,
            resultsAccessKey: result.result_collection.results_access_key,
            nextStep: result.next_step.method,
            content: result.next_step.content,
            shouldRefresh: should_refresh,
            refreshAfter: refresh_after
          }
    
          redirect "/advanced-popup?#{URI.encode_www_form(query_params)}"
        end
      rescue TrinsicApi::ApiError => e
        error_content = e.response_body.to_s
        redirect "/advanced-popup?error=#{URI.encode_www_form_component(error_content)}"
      end
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
      json AdvancedRoutes.deep_transform(result.to_body)
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

      json AdvancedRoutes.deep_transform(result.to_body)
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