# Database commands
run_db:
	docker compose --env-file=.env -f docker-compose-local.yml up -d

close_db: 
	docker compose -f docker-compose-local.yml down

# Install dependencies
install:
	pip install -r requirements.txt

# Migration commands
create-migration:
	alembic revision --autogenerate -m "$(message)"

migrate:
	alembic upgrade head

migrate-down:
	alembic downgrade -1

# Seed data
seed:
	python -m app.seed_data

# Application commands
run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Setup everything from scratch
setup: install run_db
	sleep 10
	$(MAKE) create-migration message="Initial migration"
	$(MAKE) migrate
	$(MAKE) seed

# Development workflow
dev: run_db migrate seed run

# Clean everything
clean: close_db
	docker volume rm $$(docker volume ls -q | grep mysql) || true