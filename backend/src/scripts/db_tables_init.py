import time
import sys
from sqlalchemy import text

from src.database import engine, Base
import src.db_models

def wait_for_db(max_retries=10, delay=5):
    print("⏳ Waiting for database to be ready...")

    for attempt in range(max_retries):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            print("Database connection successful.")
            return True 
        except Exception as e:
            print(f"Database connection failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print("Max retries reached. Exiting.")
                return False

def init_db():
    if not wait_for_db():
        print("❌ Cannot initialize database - connection failed")
        sys.exit(1)

    print("🔧 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

def drop_all_tables():
    Base.metadata.drop_all(bind=engine)
    print("Database tables dropped.")

if __name__ == "__main__":
    init_db()