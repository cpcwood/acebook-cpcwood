# This file is used by Rack-based servers to start the application.
ENV['RAILS_SERVE_STATIC_FILES'] = 'true'
require_relative 'config/environment'

run Rails.application
