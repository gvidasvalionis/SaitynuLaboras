.PHONY: help install dev db-up db-down db-restart db-logs db-shell db-reset run test clean docker-build docker-up docker-down docker-logs

help:
	@echo "Available commands:"
	@echo "  make install   - Install Python dependencies"
	@echo "  make dev   - Setup development environment (install + db-up )"
	@echo ""
	@echo "Database commands:"
	@echo "  make db-up - Start MySQL database"
	@echo "  make db-down   - Stop MySQL database"
	@echo "  make db-restart- Restart MySQL database"
	@echo "  make db-logs   - View database logs"
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
dev: install db-up
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

# Run application
run:
	@echo "🚀 Starting FastAPI application..."
	@echo "📍 API: http://localhost:80"
	@echo "📚 Docs: http://localhost:80/docs"
	uvicorn src.main:app --host 0.0.0.0 --port 80 --reload

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

# Create a new migration (autogenerate from model changes)
# Usage: make migrate-create MSG="add user email verification"
# Then: make migrate-up
migrate-create:
	alembic revision --autogenerate -m "$(MSG)"

# Apply all pending migrations
migrate-up:
	alembic upgrade head

# Show migration history
migrate-history:
	alembic history

# Show current migration version
migrate-current:
	alembic current