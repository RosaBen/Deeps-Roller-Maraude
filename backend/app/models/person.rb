class Person < ApplicationRecord
  validates :description, presence: true, length: { minimum: 10 }
  validates :latitude, presence: true, numericality: { in: -90.0..90.0 }
  validates :longitude, presence: true, numericality: { in: -180.0..180.0 }
  validates :gender, presence: true, inclusion: { in: %w[homme femme autre non-specifie] }
  validates :age_category, presence: true, inclusion: { in: %w[adulte enfant] }
  validates :date_encounter, presence: true
  
  scope :visited, -> { where(location_visited: true) }
  scope :unvisited, -> { where(location_visited: false) }
  scope :adults, -> { where(age_category: 'adulte') }
  scope :children, -> { where(age_category: 'enfant') }
  scope :recent, -> { order(date_encounter: :desc) }
  
  def self.stats
    {
      total: count,
      visited: visited.count,
      unvisited: unvisited.count,
      adults: adults.count,
      children: children.count
    }
  end
end
