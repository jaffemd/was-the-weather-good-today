# Weather App Project Plan

## Project Overview
Build a simple weather tracking web application where users can log daily weather as "good", "bad", or "okay" and visualize the data in a calendar-style grid.

## Tech Stack
- **Frontend**: React with Material-UI (MUI) components
- **Backend**: Ruby on Rails API
- **Database**: SQLite (development), PostgreSQL (production)
- **Deployment**: Render (free tier with integrated PostgreSQL)
- **Environment**: Node.js 24.4.0, Ruby 3.4.4 (managed by asdf)

## Project Structure
```
weather-app/
├── backend/                    # Rails API
├── frontend/                   # React app
├── default-weather-config.json # Default weather entries (empty initially)
├── .tool-versions              # asdf version management
└── README.md
```

## Deployment Platform: Render

**Render Free Tier Includes:**
- 512 MB RAM, 0.1 CPU for web services
- Free PostgreSQL database
- Automatic SSL certificates
- Git-based deployments
- Static site hosting for React frontend

**Why Render:**
- True free tier (no time limits or credit expiration)
- Integrated Rails and PostgreSQL support
- Single platform for both frontend and backend
- Perfect for personal projects with room to scale

## Application Architecture

### Frontend (React)
- **Route 1** (`/`): Calendar visualization page
  - Traditional calendar grid layout (7-day weeks)
  - Current month at top, scroll down for previous months (max 12)
  - Color-coded squares: Green (good), Yellow (okay), Red (bad), Gray (no data/future)
  - Mobile-first responsive design with max-width for desktop
- **Route 2** (`/set_weather`): Data entry form (semi-hidden route)
  - MUI DatePicker (defaults to today)
  - Dropdown: "good", "bad", "okay"
  - Updates existing entries for duplicate dates

### Backend (Rails API)
- **Models**: 
  - `WeatherEntry` (date, rating, created_at)
- **API Endpoints**:
  - `GET /api/weather_entries/calendar` - Fetch entries grouped by month, coalesced with defaults
  - `POST /api/weather_entries` - Create new weather entry
  - `PUT /api/weather_entries/:id` - Update existing entry
- **Default Data**: `default-weather-config.json` provides fallback entries
- **Database**: PostgreSQL (for Render compatibility)

## Implementation Plan

### Phase 1: Backend Setup
1. **Rails API Setup**
   ```bash
   mkdir backend
   cd backend
   rails new . --api --database=postgresql --skip-git
   ```

2. **Generate Model & Migration**
   ```bash
   rails generate model WeatherEntry date:date rating:string
   rails db:migrate
   ```

3. **Create API Controller**
   - `WeatherEntriesController` with CRUD operations
   - Default data loading from `default-weather-config.json`
   - Data coalescing logic (database entries override defaults)
   - Add validations (date uniqueness, rating enum)
   - Enable CORS for React frontend

4. **Add Routes**
   ```ruby
   namespace :api do
     resources :weather_entries, only: [:create, :update] do
       collection do
         get :calendar
       end
     end
   end
   ```

### Phase 2: Frontend Setup
1. **React App Creation**
   ```bash
   mkdir frontend
   cd frontend
   npx create-react-app . --template typescript
   npm install axios react-router-dom
   ```

2. **Install Material-UI (MUI)**
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   npm install @mui/x-date-pickers
   npm install @mui/icons-material
   ```

3. **Component Structure**
   ```
   src/
   ├── components/
   │   ├── Calendar/
   │   │   ├── CalendarGrid.js
   │   │   └── MonthView.js
   │   ├── WeatherForm/
   │   │   ├── WeatherForm.js
   │   │   └── MUIDatePicker.js
   │   └── Layout/
   │       └── Header.js
   ├── services/
   │   └── api.js
   └── App.js
   ```

### Phase 3: Calendar Implementation
1. **Calendar Grid Component**
   - Traditional 7-day week grid layout (no day-of-week headers)
   - Display 12 months of data (current + 11 previous)
   - Mobile-first responsive design
   - Day squares with proper spacing and color coding
   - Month/year labels only

2. **Data Management**
   - Fetch weather entries from API (includes defaults + database entries)
   - Map coalesced data to calendar grid
   - Handle empty states (gray squares)

### Phase 4: Form Implementation
1. **Weather Entry Form**
   - MUI DatePicker component (auto desktop/mobile responsive)
   - MUI Select dropdown with "good", "bad", "okay" options
   - Form validation using MUI components
   - API integration for submissions

2. **User Experience**
   - Success/error messaging
   - Redirect to calendar after submission
   - Handle duplicate date entries (update existing)

### Phase 5: Styling & Polish
1. **Calendar Styling**
   - Mobile-first responsive design
   - Desktop max-width for centered mobile-app appearance
   - Traditional calendar grid with day-of-week headers
   - Material Design color scheme for weather states
   - Smooth scrolling between months

2. **Form Styling**
   - Consistent mobile-first design
   - MUI theme integration
   - Material Design form components
   - Loading states with MUI CircularProgress

### Phase 6: Deployment
1. **Backend Deployment (Render)**
   - Create `render.yaml` configuration
   - Set up PostgreSQL database
   - Configure environment variables
   - Deploy Rails API

2. **Frontend Deployment (Render Static Site)**
   - Build React app
   - Configure API endpoint URLs
   - Deploy static site
   - Set up custom domain (optional)

## Development Commands

### Backend (Rails)
```bash
cd backend
# Start development server
rails server -p 3001

# Run migrations
rails db:migrate

# Run tests
rails test

# Console access
rails console
```

### Frontend (React)
```bash
cd frontend
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Database Schema

```sql
-- weather_entries table
CREATE TABLE weather_entries (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  rating VARCHAR(10) NOT NULL CHECK (rating IN ('good', 'bad', 'okay')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Default Weather Configuration

```json
// default-weather-config.json format
[
  {
    "date": "2024-01-15",
    "rating": "good"
  },
  {
    "date": "2024-01-16", 
    "rating": "bad"
  }
]
```

**Data Coalescing Logic:**
- Load defaults from `default-weather-config.json`
- Load entries from database
- Database entries override defaults for matching dates
- Return combined dataset grouped by month

## Environment Variables

### Development
```bash
# Backend (.env)
DATABASE_URL=postgresql://localhost/weather_app_development
CORS_ORIGINS=http://localhost:3000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001/api
```

### Production
```bash
# Backend (Render)
DATABASE_URL=[provided by Render]
CORS_ORIGINS=[frontend domain]

# Frontend (Render)
REACT_APP_API_URL=[backend domain]/api
```

## Timeline Estimate
- **Phase 1-2**: Backend & Frontend setup (1-2 days)
- **Phase 3**: Calendar implementation (2-3 days)
- **Phase 4**: Form implementation (1 day)
- **Phase 5**: Styling & polish (1-2 days)
- **Phase 6**: Deployment setup (1 day)

**Total**: 6-9 days for a fully functional application

## Future Enhancements (Post-MVP)
- User authentication
- Weather data export (CSV/JSON)
- Weather statistics/trends
- Mobile app (React Native)
- Weather API integration for automatic suggestions