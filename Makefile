# Weather App Makefile
# Run the full stack application

.PHONY: help install dev backend frontend clean stop

# Default target
help:
	@echo "Weather App Commands:"
	@echo "  make install  - Install all dependencies"
	@echo "  make dev      - Start both backend and frontend servers"
	@echo "  make backend  - Start only the Rails backend server"
	@echo "  make frontend - Start only the React frontend server"
	@echo "  make clean    - Clean dependencies and restart"
	@echo "  make stop     - Stop all running servers"

# Install all dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && bundle install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Setting up database..."
	cd backend && rails db:create db:migrate
	@echo "✅ All dependencies installed!"

# Start both servers (main command)
dev:
	@echo "🚀 Starting Weather App..."
	@echo "Stopping any existing servers first..."
	@make stop
	@sleep 2
	@echo "Backend will be available at: http://localhost:3001"
	@echo "Frontend will be available at: http://localhost:5173"
	@echo "Press Ctrl+C to stop both servers"
	@make -j2 backend frontend

# Start only backend server
backend:
	@echo "Starting Rails backend on port 3001..."
	cd backend && rails server -p 3001

# Start only frontend server  
frontend:
	@echo "Starting React frontend on port 5173..."
	cd frontend && npm run dev

# Clean and restart
clean:
	@echo "Cleaning dependencies..."
	cd frontend && rm -rf node_modules package-lock.json
	cd frontend && npm install
	cd backend && bundle install
	@echo "✅ Dependencies cleaned and reinstalled!"

# Stop all servers
stop:
	@echo "Stopping all servers..."
	-pkill -f "rails server"
	-pkill -f "vite"
	-pkill -f "puma"
	-lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	-lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@echo "✅ All servers stopped!"

# Development setup (first time)
setup: install
	@echo "🎉 Weather App setup complete!"
	@echo "Run 'make dev' to start the application"