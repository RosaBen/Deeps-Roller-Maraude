class Api::V1::DashboardController < ApplicationController
  def stats
    stats = Person.stats
    recent_encounters = Person.recent.limit(5)
    
    render json: {
      total_persons: stats[:total],
      adults_count: stats[:adults],
      children_count: stats[:children],
      visited_locations: stats[:visited],
      recent_encounters: recent_encounters
    }, status: :ok
  end
end
