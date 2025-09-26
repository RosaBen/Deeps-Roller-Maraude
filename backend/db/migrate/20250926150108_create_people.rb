class CreatePeople < ActiveRecord::Migration[8.0]
  def change
    create_table :people do |t|
      t.text :description, null: false
      t.decimal :latitude, precision: 10, scale: 6, null: false
      t.decimal :longitude, precision: 10, scale: 6, null: false
      t.string :gender, null: false
      t.string :age_category, null: false
      t.date :date_encounter, null: false
      t.boolean :location_visited, default: false, null: false

      t.timestamps
    end
    
    add_index :people, [:latitude, :longitude]
    add_index :people, :date_encounter
    add_index :people, :location_visited
  end
end
