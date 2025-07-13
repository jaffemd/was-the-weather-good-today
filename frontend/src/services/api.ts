import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface WeatherEntry {
  id?: number;
  date: string;
  rating: 'good' | 'bad' | 'okay';
}

export interface MonthData {
  month: string;
  entries: WeatherEntry[];
}

export interface CalendarData {
  [monthKey: string]: MonthData;
}

// Get calendar data (grouped by month)
export const getCalendarData = async (): Promise<CalendarData> => {
  const response = await api.get('/weather_entries/calendar');
  return response.data;
};

// Create or update weather entry
export const saveWeatherEntry = async (entry: Omit<WeatherEntry, 'id'>): Promise<WeatherEntry> => {
  const response = await api.post('/weather_entries', {
    weather_entry: entry
  });
  return response.data;
};

// Update existing weather entry
export const updateWeatherEntry = async (id: number, entry: Omit<WeatherEntry, 'id'>): Promise<WeatherEntry> => {
  const response = await api.put(`/weather_entries/${id}`, {
    weather_entry: entry
  });
  return response.data;
};

export default api;