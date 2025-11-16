.PHONY: help install dev db-up db-down db-restart db-logs db-shell db-init db-reset run test clean docker-build docker-up docker-down docker-logs

help:
	@echo "Available commands:"
	@echo "  make install   - Install Python dependencies"
	@echo "  make dev   - Setup development environment (install + db-up + db-init)"
	@echo ""
	@echo "Database commands:"
	@echo "  make db-up - Start MySQL database"
	@echo "  make db-down   - Stop MySQL database"
	@echo "  make db-restart- Restart MySQL database"
	@echo "  make db-logs   - View database logs"
	@echo "  make db-init   - Create database tables"
	@echo "  make db-reset  - Reset database (WARNING: deletes all data)"
	@echo ""
	@echo "Application commands:"
	@echo "  make run   - Run FastAPI application"
	@echo ""
	@echo "Docker commands:"
	@echo "  make docker-build  - Build Docker images"
	@echo "  make docker-up - Start all services (app + db)"
	@echo "  make docker-down   - Stop all services"
	@echo "  make docker-logs   - View all service logs"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean - Remove cache and temporary files"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	pip install -r requirements.txt
	@echo "✅ Dependencies installed!"

# Setup development environment
dev: db-up
	@make db-init
	@echo "✅ Development environment ready!"
	@echo "Run 'make run' to start the application"

# Database commands
db-up:
	@echo "🚀 Starting MySQL database..."
	docker-compose up -d mysql
	@echo "✅ Database started!"

db-down:
	@echo "🛑 Stopping MySQL database..."
	docker-compose down
	@echo "✅ Database stopped!"

db-restart:
	@echo "🔄 Restarting MySQL database..."
	docker-compose restart mysql
	@echo "✅ Database restarted!"

db-logs:
	@echo "📋 Database logs (Ctrl+C to exit):"
	docker-compose logs -f mysql

db-init:
	@echo "🔧 Creating database tables..."
	python -m src.scripts.db_tables_init
	@echo "✅ Tables created!"

db-reset:
	@echo "⚠️  WARNING: This will delete all data!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "🗑️  Resetting database..."
	docker-compose down -v
	@make db-up
	@sleep 5
	@make db-init
	@echo "✅ Database reset complete!"

# Run application
run:
	@echo "🚀 Starting FastAPI application..."
	@echo "📍 API: http://localhost:8000"
	@echo "📚 Docs: http://localhost:8000/docs"
	uvicorn src.main:app --reload

# Docker full stack
docker-build:
	@echo "🏗️  Building Docker images..."
	docker-compose build
	@echo "✅ Build complete!"

docker-up: docker-build
	@echo "🚀 Starting all services..."
	docker-compose up -d
	@echo "✅ All services started!"
	@echo "📍 API: http://localhost:8000"
	@echo "📚 Docs: http://localhost:8000/docs"

docker-down:
	@echo "🛑 Stopping all services..."
	docker-compose down
	@echo "✅ All services stopped!"

docker-logs:
	@echo "📋 Service logs (Ctrl+C to exit):"
	docker-compose logs -f

# Cleanup
clean:
	@echo "🧹 Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name "*.pyo" -delete 2>/dev/null || true
	find . -type f -name "*.pyd" -delete 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	@echo "✅ Cleanup complete!"

clean-all:
	@echo "🧹 Destroying everything..."
	@echo "⚠️  This will remove all containers, volumes, and cached files!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	docker-compose down -v --rmi local
	@make clean
	@echo "✅ Everything destroyed!"