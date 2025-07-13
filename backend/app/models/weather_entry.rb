class WeatherEntry < ApplicationRecord
  validates :date, presence: true, uniqueness: true
  validates :rating, presence: true, inclusion: { in: %w[good bad okay] }
end
