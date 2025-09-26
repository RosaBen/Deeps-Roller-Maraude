class AddFieldsToPeople < ActiveRecord::Migration[8.0]
  def change
    add_column :people, :first_name, :string
    add_column :people, :last_name, :string
    add_column :people, :consent_given, :boolean
    add_column :people, :signature, :text
  end
end
