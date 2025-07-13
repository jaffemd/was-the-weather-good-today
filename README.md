# Weather Tracker 🌤️

A simple weather tracking web application that allows users to log daily weather experiences as "good", "bad", or "okay" and visualize them in a calendar-style grid.

## 📱 Features

- **Calendar View**: Visual grid showing weather ratings with color-coded squares
  - 🟢 Green = Good weather
  - 🟡 Yellow = Okay weather  
  - 🔴 Red = Bad weather
  - ⚪ Gray = No data/future dates
- **Weather Entry Form**: Simple form to log daily weather ratings
- **Historical Data**: Pre-loaded with Chicago weather data for 2025
- **Mobile-First Design**: Responsive interface optimized for all devices

## 🏗️ Tech Stack

### Frontend
- **React** with TypeScript
- **Material-UI (MUI)** for components and styling
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Ruby on Rails** API-only application
- **PostgreSQL** database (production) / SQLite (development)
- **CORS** enabled for frontend integration

### Deployment
- **Render** for both frontend and backend hosting
- **Free tier** with PostgreSQL database

## 🚀 Quick Start

### Prerequisites
- Node.js 24.4.0+ (managed by asdf)
- Ruby 3.4.4+ (managed by asdf)
- PostgreSQL (for local development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/weather-app.git
   cd weather-app
   ```

2. **Install dependencies and start development servers**
   ```bash
   make dev
   ```
   This will:
   - Install frontend dependencies
   - Install backend dependencies  
   - Start Rails server on http://localhost:3001
   - Start React dev server on http://localhost:5173

3. **Set up the database**
   ```bash
   cd backend
   rails db:migrate
   rails db:seed  # Optional: loads default weather data
   ```

### Available Commands

```bash
make dev          # Start both frontend and backend in development
make install      # Install all dependencies
make clean        # Clean build artifacts
make test         # Run tests for both frontend and backend
```

## 📂 Project Structure

```
weather-app/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Calendar/     # Calendar grid and month views
│   │   │   ├── WeatherForm/  # Weather entry form
│   │   │   └── Layout/       # Header and layout components
│   │   ├── services/         # API service layer
│   │   └── main.tsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Rails API application
│   ├── app/
│   │   ├── controllers/api/ # API controllers
│   │   └── models/          # ActiveRecord models
│   ├── config/              # Rails configuration
│   ├── db/                  # Database migrations and schema
│   └── weather_data/        # Weather data scripts and files
├── default-weather-config.json  # Default weather entries
├── DEPLOYMENT.md            # Deployment guide for Render
└── README.md               # This file
```

## 🌐 API Endpoints

### Weather Entries
- `GET /api/weather_entries/calendar` - Fetch weather data grouped by month
- `POST /api/weather_entries` - Create new weather entry
- `PUT /api/weather_entries/:id` - Update existing weather entry

### Data Format
```json
{
  "weather_entry": {
    "date": "2025-01-15",
    "rating": "good"
  }
}
```

## 🎨 Application Routes

- **`/`** - Calendar visualization (main page)
- **`/set_weather`** - Weather entry form

## 📊 Default Data

The application comes pre-loaded with Chicago weather data for 2025 (January 1 - July 12) based on:
- Temperature ranges (ideal: 60-80°F)
- Precipitation levels
- Wind speed conditions

Data is stored in `default-weather-config.json` and loaded via the API when no user entries exist.

## 🚢 Deployment

The application is configured for deployment on [Render](https://render.com) using their free tier.

### Deploy to Render
1. Push your code to GitHub
2. Follow the detailed instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Configure environment variables as specified
4. Deploy backend first, then frontend

### Environment Variables

**Backend (Production):**
```
DATABASE_URL=<provided-by-render>
RAILS_MASTER_KEY=<from-config/master.key>
RAILS_ENV=production
FRONTEND_URL=<your-frontend-url>
```

**Frontend (Production):**
```
VITE_API_URL=<your-backend-url>/api
```

## 🧪 Testing

```bash
# Run backend tests
cd backend && rails test

# Run frontend tests  
cd frontend && npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Enhancements

- User authentication and personal weather tracking
- Weather data export (CSV/JSON)
- Weather statistics and trends analysis
- Integration with weather APIs for automatic suggestions
- Mobile app version using React Native
- Social features for sharing weather experiences

---

Built with ❤️ using React, Rails, and Material-UI