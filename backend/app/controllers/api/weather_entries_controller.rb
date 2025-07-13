class Api::WeatherEntriesController < ApplicationController
  def calendar
    # Load default entries
    default_entries = load_default_entries
    
    # Load database entries
    db_entries = WeatherEntry.all.index_by(&:date)
    
    # Coalesce: database entries override defaults
    all_entries = default_entries.merge(db_entries)
    
    # Group by month for calendar display
    grouped_entries = group_by_month(all_entries.values)
    
    render json: grouped_entries
  end

  def create
    @weather_entry = WeatherEntry.find_by(date: weather_entry_params[:date])
    
    if @weather_entry
      # Update existing entry
      if @weather_entry.update(weather_entry_params)
        render json: @weather_entry, status: :ok
      else
        render json: { errors: @weather_entry.errors }, status: :unprocessable_entity
      end
    else
      # Create new entry
      @weather_entry = WeatherEntry.new(weather_entry_params)
      if @weather_entry.save
        render json: @weather_entry, status: :created
      else
        render json: { errors: @weather_entry.errors }, status: :unprocessable_entity
      end
    end
  end

  def update
    @weather_entry = WeatherEntry.find(params[:id])
    
    if @weather_entry.update(weather_entry_params)
      render json: @weather_entry
    else
      render json: { errors: @weather_entry.errors }, status: :unprocessable_entity
    end
  end

  private

  def weather_entry_params
    params.require(:weather_entry).permit(:date, :rating)
  end

  def load_default_entries
    config_path = Rails.root.join('..', 'default-weather-config.json')
    
    if File.exist?(config_path)
      defaults_data = JSON.parse(File.read(config_path))
      defaults_hash = {}
      
      defaults_data.each do |entry|
        date = Date.parse(entry['date'])
        defaults_hash[date] = WeatherEntry.new(
          date: date,
          rating: entry['rating']
        )
      end
      
      defaults_hash
    else
      {}
    end
  rescue JSON::ParserError, Date::Error => e
    Rails.logger.warn "Error loading default weather config: #{e.message}"
    {}
  end

  def group_by_month(entries)
    grouped = entries.group_by { |entry| entry.date.beginning_of_month }
    
    result = {}
    grouped.each do |month_start, month_entries|
      month_key = month_start.strftime('%Y-%m')
      result[month_key] = {
        month: month_start.strftime('%B %Y'),
        entries: month_entries.map do |entry|
          {
            date: entry.date.to_s,
            rating: entry.rating,
            id: entry.persisted? ? entry.id : nil
          }
        end
      }
    end
    
    result
  end
end
