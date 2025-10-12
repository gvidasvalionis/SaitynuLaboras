from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Team, Driver, GrandPrix, User, UserRole, Strategy, StrategyStatus

def create_default_data():
    """Create default data for the application"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Team).first():
            print("Default data already exists, skipping...")
            return
        
        print("Creating default data...")
        
        # Create teams
        teams_data = [
            {"name": "Red Bull Racing"},
            {"name": "Mercedes"},
            {"name": "Ferrari"},
            {"name": "McLaren"},
            {"name": "Alpine"},
            {"name": "Aston Martin"},
            {"name": "Williams"},
            {"name": "AlphaTauri"},
            {"name": "Alfa Romeo"},
            {"name": "Haas"},
        ]
        
        teams = []
        for team_data in teams_data:
            team = Team(**team_data)
            db.add(team)
            teams.append(team)
        
        db.flush()  # Flush to get IDs
        
        # Create drivers
        drivers_data = [
            {"name": "Max Verstappen", "team_id": teams[0].id},
            {"name": "Sergio Perez", "team_id": teams[0].id},
            {"name": "Lewis Hamilton", "team_id": teams[1].id},
            {"name": "George Russell", "team_id": teams[1].id},
            {"name": "Charles Leclerc", "team_id": teams[2].id},
            {"name": "Carlos Sainz", "team_id": teams[2].id},
            {"name": "Lando Norris", "team_id": teams[3].id},
            {"name": "Oscar Piastri", "team_id": teams[3].id},
        ]
        
        drivers = []
        for driver_data in drivers_data:
            driver = Driver(**driver_data)
            db.add(driver)
            drivers.append(driver)
        
        # Create Grand Prix events
        grand_prix_data = [
            {"name": "Bahrain Grand Prix", "year": 2024},
            {"name": "Saudi Arabian Grand Prix", "year": 2024},
            {"name": "Australian Grand Prix", "year": 2024},
            {"name": "Japanese Grand Prix", "year": 2024},
            {"name": "Chinese Grand Prix", "year": 2024},
            {"name": "Miami Grand Prix", "year": 2024},
            {"name": "Emilia Romagna Grand Prix", "year": 2024},
            {"name": "Monaco Grand Prix", "year": 2024},
            {"name": "Canadian Grand Prix", "year": 2024},
            {"name": "Spanish Grand Prix", "year": 2024},
        ]
        
        grand_prix_list = []
        for gp_data in grand_prix_data:
            grand_prix = GrandPrix(**gp_data)
            db.add(grand_prix)
            grand_prix_list.append(grand_prix)
        
        # Create default admin user
        admin_user = User(
            username="admin",
            email="admin@f1strategies.com",
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        
        # Create sample user
        sample_user = User(
            username="f1_fan",
            email="fan@f1strategies.com",
            role=UserRole.USER
        )
        db.add(sample_user)
        
        db.flush()  # Flush to get user IDs
        
        # Create sample strategies
        strategies_data = [
            {
                "title": "Monaco Conservative Strategy",
                "description": "Conservative approach for Monaco GP with minimal pit stops",
                "author_id": sample_user.id,
                "driver_id": drivers[0].id,  # Max Verstappen
                "team_id": teams[0].id,      # Red Bull Racing
                "grand_prix_id": grand_prix_list[7].id,  # Monaco GP
                "fuel_load": 110,
                "total_pit_stops": 1,
                "strategy_plan": [
                    {"lap": 35, "tire": "Hard", "fuel_added": 0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": admin_user.id
            },
            {
                "title": "Bahrain Aggressive Two-Stop",
                "description": "Aggressive two-stop strategy for Bahrain with medium-hard compounds",
                "author_id": sample_user.id,
                "driver_id": drivers[2].id,  # Lewis Hamilton
                "team_id": teams[1].id,      # Mercedes
                "grand_prix_id": grand_prix_list[0].id,  # Bahrain GP
                "fuel_load": 105,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 18, "tire": "Medium", "fuel_added": 25.5},
                    {"lap": 42, "tire": "Hard", "fuel_added": 20.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": admin_user.id
            },
            {
                "title": "Spanish GP Undercut Strategy",
                "description": "Early pit stop to undercut competitors at Circuit de Catalunya",
                "author_id": admin_user.id,
                "driver_id": drivers[4].id,  # Charles Leclerc
                "team_id": teams[2].id,      # Ferrari
                "grand_prix_id": grand_prix_list[9].id,  # Spanish GP
                "fuel_load": 108,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 15, "tire": "Medium", "fuel_added": 30.0},
                    {"lap": 38, "tire": "Hard", "fuel_added": 22.5}
                ],
                "status": StrategyStatus.PENDING_APPROVAL
            },
            {
                "title": "McLaren One-Stop Gamble",
                "description": "Risky one-stop strategy banking on tire degradation",
                "author_id": sample_user.id,
                "driver_id": drivers[6].id,  # Lando Norris
                "team_id": teams[3].id,      # McLaren
                "grand_prix_id": grand_prix_list[5].id,  # Miami GP
                "fuel_load": 115,
                "total_pit_stops": 1,
                "strategy_plan": [
                    {"lap": 28, "tire": "Hard", "fuel_added": 15.0}
                ],
                "status": StrategyStatus.REJECTED
            }
        ]
        
        for strategy_data in strategies_data:
            strategy = Strategy(**strategy_data)
            db.add(strategy)
        
        db.commit()
        print("Default data created successfully!")
        
    except Exception as e:
        print(f"Error creating default data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_default_data()