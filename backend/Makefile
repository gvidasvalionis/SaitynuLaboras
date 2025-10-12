# Database commands
run_db:
	docker compose --env-file=.env -f docker-compose-local.yml up -d
	@echo "Starting database..."

close_db: 
	docker compose -f docker-compose-local.yml down

# Wait for database to be ready
wait_db:
	@echo "Waiting for database to be ready..."
	@sleep 20
	@echo "Database should be ready now"

# Install dependencies
install:
	pip install -r requirements.txt

# Migration commands
create-migration:
	alembic revision --autogenerate -m "$(message)"

migrate: wait_db
	alembic upgrade head

migrate-down: wait_db
	alembic downgrade -1

# Seed data
seed: wait_db
	python -m app.seed_data

# Application commands
run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Setup everything from scratch
setup: install run_db wait_db
	$(MAKE) create-migration message="Initial migration"
	$(MAKE) migrate
	$(MAKE) seed

# Development workflow
dev: close_db run_db wait_db migrate seed run

# Quick start (if DB already exists)
quick: migrate seed run

# Clean everything
clean: close_db
	docker volume rm $$(docker volume ls -q | grep mysql) || true