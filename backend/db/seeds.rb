# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Données de test pour le développement
if Rails.env.development?
  puts "Création de données de test..."

  # Coordonnées de différents arrondissements de Paris
  paris_locations = [
    { lat: 48.8566, lng: 2.3522, area: "Centre de Paris" },
    { lat: 48.8738, lng: 2.2950, area: "Arc de Triomphe" },
    { lat: 48.8584, lng: 2.2945, area: "Tour Eiffel" },
    { lat: 48.8606, lng: 2.3376, area: "Louvre" },
    { lat: 48.8529, lng: 2.3500, area: "Notre-Dame" },
    { lat: 48.8767, lng: 2.3097, area: "Montmartre" },
    { lat: 48.8449, lng: 2.3750, area: "Bastille" },
    { lat: 48.8590, lng: 2.3890, area: "République" },
    { lat: 48.8415, lng: 2.3730, area: "Gare de Lyon" },
    { lat: 48.8848, lng: 2.3434, area: "Gare du Nord" }
  ]

  genders = %w[homme femme autre non-specifie]
  age_categories = %w[adulte enfant]
  
  descriptions = [
    "Homme âgé, vêtu d'un manteau marron, assis près de l'entrée du métro",
    "Femme avec un chien, sac de couchage bleu, demande de l'aide",
    "Personne jeune, cheveux longs, guitare, joue de la musique",
    "Homme avec une pancarte, veste noire déchirée, très maigre",
    "Femme âgée, chariot avec affaires personnelles, paraît malade",
    "Jeune homme, baskets usées, sweat à capuche gris",
    "Personne avec plusieurs sacs plastique, dort sous un carton",
    "Homme barbu, couverture rouge, accompagné d'un chat",
    "Femme enceinte, paraît très fatiguée, assise sur un banc",
    "Adolescent, sac à dos déchiré, demande de la nourriture"
  ]

  # Créer 15 personnes fictives
  15.times do |i|
    location = paris_locations.sample
    
    # Ajouter un peu de variation aux coordonnées
    lat_variation = (rand - 0.5) * 0.01 # ±0.005 degrés
    lng_variation = (rand - 0.5) * 0.01
    
    Person.create!(
      description: descriptions.sample,
      latitude: location[:lat] + lat_variation,
      longitude: location[:lng] + lng_variation,
      gender: genders.sample,
      age_category: age_categories.sample,
      date_encounter: rand(30.days).seconds.ago.to_date,
      location_visited: [true, false].sample
    )
    
    print "."
  end

  puts "\n#{Person.count} personnes créées avec succès!"
  puts "Statistiques:"
  puts "- Adultes: #{Person.adults.count}"
  puts "- Enfants: #{Person.children.count}"
  puts "- Lieux visités: #{Person.visited.count}"
  puts "- Lieux non visités: #{Person.unvisited.count}"
end
