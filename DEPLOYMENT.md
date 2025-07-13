# Deployment Guide - Render

This guide will walk you through deploying the Weather App to Render.

## Prerequisites

1. **Git repository**: Your code must be in a Git repository (GitHub, GitLab, etc.)
2. **Render account**: Sign up at [render.com](https://render.com)

## Step 1: Deploy the Backend (Rails API)

### 1.1 Create Web Service
1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `weather-app-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Ruby
   - **Build Command**: `./bin/render-build.sh`
   - **Start Command**: `bundle exec puma -C config/puma.rb`

### 1.2 Create PostgreSQL Database
1. In your Render dashboard, click "New +" and select "PostgreSQL"
2. Configure the database:
   - **Name**: `weather-app-db`
   - **Database Name**: `weather_app_production`
   - **User**: `weather_app_user`
   - **Region**: Oregon (US West)
   - **Plan**: Free

### 1.3 Configure Environment Variables
In your web service settings, add these environment variables:

```
DATABASE_URL=<automatically connected from database>
RAILS_MASTER_KEY=<copy from backend/config/master.key>
RAILS_ENV=production
BUNDLE_WITHOUT=development:test
```

**Important**: Copy the `RAILS_MASTER_KEY` from `backend/config/master.key` file.

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait for the deployment to complete (this may take 10-15 minutes for the first deploy)
3. Note your backend URL (e.g., `https://weather-app-backend.onrender.com`)

## Step 2: Deploy the Frontend (React App)

### 2.1 Create Static Site
1. In your Render dashboard, click "New +" and select "Static Site"
2. Connect your Git repository
3. Configure the site:
   - **Name**: `weather-app-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `./render-build.sh`
   - **Publish Directory**: `dist`

### 2.2 Configure Environment Variables
In your static site settings, add this environment variable:

```
VITE_API_URL=<your-backend-url>/api
```

Replace `<your-backend-url>` with your actual backend URL from Step 1.4.

### 2.3 Deploy
1. Click "Create Static Site"
2. Wait for the deployment to complete (5-10 minutes)
3. Note your frontend URL (e.g., `https://weather-app-frontend.onrender.com`)

## Step 3: Configure CORS

### 3.1 Update Backend Environment
1. Go to your backend web service in Render
2. Add this environment variable:

```
FRONTEND_URL=<your-frontend-url>
```

Replace `<your-frontend-url>` with your actual frontend URL from Step 2.3.

### 3.2 Redeploy Backend
1. In your backend service, click "Manual Deploy" → "Deploy latest commit"
2. Wait for redeployment to complete

## Step 4: Test Your Application

1. Visit your frontend URL
2. Test the calendar view at `/`
3. Test adding weather entries at `/set_weather`
4. Verify data persists between visits

## Troubleshooting

### Backend Issues
- Check logs in Render dashboard under your web service
- Ensure `RAILS_MASTER_KEY` is correctly set
- Verify database connection

### Frontend Issues
- Check build logs in Render dashboard under your static site
- Ensure `VITE_API_URL` points to correct backend URL
- Test API endpoints directly in browser

### CORS Issues
- Verify `FRONTEND_URL` is set correctly in backend
- Check that frontend URL matches exactly (including https)

## Free Tier Limitations

- **Backend**: May sleep after 15 minutes of inactivity (takes ~30 seconds to wake up)
- **Database**: 1GB storage limit
- **Frontend**: No sleep, always available

## Updating Your App

1. Push changes to your Git repository
2. Render will automatically deploy the changes
3. For manual deployments, use "Manual Deploy" in the Render dashboard

Your weather app is now live and accessible to anyone with the frontend URL!