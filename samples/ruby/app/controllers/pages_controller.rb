class PagesController < ApplicationController
  def index
    # Serve web client sample
    external_path = File.join('../web', 'index.html')

    if File.exist?(external_path)
      send_file external_path, type: 'text/html', disposition: 'inline'
    else
      render plain: "File not found", status: :not_found
    end
  end

  def redirect
    # Serve web client sample
    external_path = File.join('../web', 'redirect.html')

    if File.exist?(external_path)
      send_file external_path, type: 'text/html', disposition: 'inline'
    else
      render plain: "File not found", status: :not_found
    end
  end
end
