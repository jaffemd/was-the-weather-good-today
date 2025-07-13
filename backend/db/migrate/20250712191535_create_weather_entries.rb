class CreateWeatherEntries < ActiveRecord::Migration[8.0]
  def change
    create_table :weather_entries do |t|
      t.date :date, null: false
      t.string :rating, null: false

      t.timestamps
    end
    
    add_index :weather_entries, :date, unique: true
  end
end
