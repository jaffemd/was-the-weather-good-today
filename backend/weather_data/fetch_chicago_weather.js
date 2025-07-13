const https = require('https');
const fs = require('fs');
const path = require('path');

// Chicago coordinates (approximately for zip code 60618)
const CHICAGO_LAT = 41.9534;
const CHICAGO_LON = -87.6645;

// Date range: January 1 to July 12, 2025
const END_DATE = '2025-07-12';
const START_DATE = '2025-01-01';

console.log(`Fetching weather data for Chicago (${CHICAGO_LAT}, ${CHICAGO_LON})`);
console.log(`Date range: ${START_DATE} to ${END_DATE}`);

// Open-Meteo API endpoint for historical weather
const apiUrl = `https://archive-api.open-meteo.com/v1/archive` +
  `?latitude=${CHICAGO_LAT}` +
  `&longitude=${CHICAGO_LON}` +
  `&start_date=${START_DATE}` +
  `&end_date=${END_DATE}` +
  `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
  `&timezone=America%2FChicago` +
  `&temperature_unit=fahrenheit` +
  `&wind_speed_unit=mph` +
  `&precipitation_unit=inch`;

console.log('API URL:', apiUrl);

// Function to determine weather rating based on conditions
function calculateWeatherRating(maxTemp, minTemp, precipitation, windSpeed) {
  // Automatic bad weather conditions
  if (maxTemp < 50 || maxTemp > 85) {
    return 'bad';
  }
  
  // Temperature comfort range (Fahrenheit)
  const idealMinTemp = 60;
  const idealMaxTemp = 80;
  
  // Precipitation thresholds (inches)
  const lightRain = 0.1;
  const heavyRain = 0.5;
  
  // Wind speed threshold (mph)
  const windyThreshold = 20;
  
  let score = 0;
  
  // Temperature scoring (only for temps 50-85°F)
  if (maxTemp >= idealMinTemp && maxTemp <= idealMaxTemp && minTemp >= 45) {
    score += 3; // Perfect temperature
  } else if (maxTemp >= 50 && maxTemp <= 85) {
    score += 2; // Good temperature
  }
  
  // Precipitation scoring
  if (precipitation === 0) {
    score += 2; // No rain is great
  } else if (precipitation <= lightRain) {
    score += 1; // Light rain is okay
  } else if (precipitation <= heavyRain) {
    score -= 1; // Moderate rain is not great
  } else {
    score -= 2; // Heavy rain is bad
  }
  
  // Wind scoring
  if (windSpeed <= 10) {
    score += 1; // Calm is nice
  } else if (windSpeed <= windyThreshold) {
    score += 0; // Moderate wind is neutral
  } else {
    score -= 1; // Very windy is not great
  }
  
  // Convert score to rating
  if (score >= 4) return 'good';
  if (score >= 1) return 'okay';
  return 'bad';
}

// Fetch weather data
https.get(apiUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const weatherData = JSON.parse(data);
      
      if (weatherData.error) {
        console.error('API Error:', weatherData.error);
        return;
      }
      
      console.log(`Received data for ${weatherData.daily.time.length} days`);
      
      // Process the weather data
      const processedData = [];
      
      for (let i = 0; i < weatherData.daily.time.length; i++) {
        const date = weatherData.daily.time[i];
        const maxTemp = weatherData.daily.temperature_2m_max[i];
        const minTemp = weatherData.daily.temperature_2m_min[i];
        const precipitation = weatherData.daily.precipitation_sum[i] || 0;
        const windSpeed = weatherData.daily.wind_speed_10m_max[i] || 0;
        
        const rating = calculateWeatherRating(maxTemp, minTemp, precipitation, windSpeed);
        
        processedData.push({
          date: date,
          rating: rating,
          details: {
            max_temp_f: Math.round(maxTemp),
            min_temp_f: Math.round(minTemp),
            precipitation_in: Math.round(precipitation * 100) / 100,
            wind_speed_mph: Math.round(windSpeed)
          }
        });
      }
      
      // Sort by date to ensure chronological order
      processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Create the output directory if it doesn't exist
      const outputDir = path.dirname(__filename);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Write the processed data to JSON file
      const outputPath = path.join(outputDir, 'chicago2025.json');
      fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
      
      console.log(`Successfully saved ${processedData.length} weather entries to ${outputPath}`);
      
      // Print summary statistics
      const goodDays = processedData.filter(d => d.rating === 'good').length;
      const okayDays = processedData.filter(d => d.rating === 'okay').length;
      const badDays = processedData.filter(d => d.rating === 'bad').length;
      
      console.log('\nWeather Summary:');
      console.log(`Good days: ${goodDays} (${Math.round(goodDays/processedData.length*100)}%)`);
      console.log(`Okay days: ${okayDays} (${Math.round(okayDays/processedData.length*100)}%)`);
      console.log(`Bad days: ${badDays} (${Math.round(badDays/processedData.length*100)}%)`);
      
    } catch (error) {
      console.error('Error parsing weather data:', error);
    }
  });
  
}).on('error', (error) => {
  console.error('Error fetching weather data:', error);
});