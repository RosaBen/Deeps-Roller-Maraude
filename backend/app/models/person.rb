class Person < ApplicationRecord
  # Active Storage associations
  has_one_attached :photo
  has_one_attached :document
  
  validates :description, presence: true, length: { minimum: 10 }
  validates :latitude, presence: true, numericality: { in: -90.0..90.0 }
  validates :longitude, presence: true, numericality: { in: -180.0..180.0 }
  validates :gender, presence: true, inclusion: { in: %w[homme femme autre non-specifie] }
  validates :age_category, presence: true, inclusion: { in: %w[adulte enfant] }
  validates :date_encounter, presence: true
  
  # Validation pour le consentement si des fichiers sont attachés
  validates :consent_given, acceptance: true, if: :has_attachments?
  validates :first_name, presence: true, if: :consent_given?
  validates :last_name, presence: true, if: :consent_given?
  
  scope :visited, -> { where(location_visited: true) }
  scope :unvisited, -> { where(location_visited: false) }
  scope :adults, -> { where(age_category: 'adulte') }
  scope :children, -> { where(age_category: 'enfant') }
  scope :recent, -> { order(date_encounter: :desc) }
  scope :with_consent, -> { where(consent_given: true) }
  scope :with_photos, -> { joins(:photo_attachment) }
  
  def self.stats
    {
      total: count,
      visited: visited.count,
      unvisited: unvisited.count,
      adults: adults.count,
      children: children.count,
      with_consent: with_consent.count,
      with_photos: with_photos.count
    }
  end
  
  def full_name
    if first_name.present? || last_name.present?
      "#{first_name} #{last_name}".strip
    else
      "Personne ##{id}"
    end
  end
  
  def photo_url
    photo.attached? ? Rails.application.routes.url_helpers.url_for(photo) : nil
  end
  
  def document_url
    document.attached? ? Rails.application.routes.url_helpers.url_for(document) : nil
  end
  
  private
  
  def has_attachments?
    photo.attached? || document.attached?
  end
end
