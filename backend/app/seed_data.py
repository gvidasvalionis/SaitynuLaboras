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
        
        # Create teams (all 10 F1 teams)
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
        
        db.commit()  # Commit to get IDs
        
        # Create drivers (20 drivers total - 2 per team)
        drivers_data = [
            # Red Bull Racing
            {"name": "Max Verstappen", "team_id": teams[0].id},
            {"name": "Sergio Perez", "team_id": teams[0].id},
            # Mercedes
            {"name": "Lewis Hamilton", "team_id": teams[1].id},
            {"name": "George Russell", "team_id": teams[1].id},
            # Ferrari
            {"name": "Charles Leclerc", "team_id": teams[2].id},
            {"name": "Carlos Sainz", "team_id": teams[2].id},
            # McLaren
            {"name": "Lando Norris", "team_id": teams[3].id},
            {"name": "Oscar Piastri", "team_id": teams[3].id},
            # Alpine
            {"name": "Pierre Gasly", "team_id": teams[4].id},
            {"name": "Esteban Ocon", "team_id": teams[4].id},
            # Aston Martin
            {"name": "Fernando Alonso", "team_id": teams[5].id},
            {"name": "Lance Stroll", "team_id": teams[5].id},
            # Williams
            {"name": "Alex Albon", "team_id": teams[6].id},
            {"name": "Logan Sargeant", "team_id": teams[6].id},
            # AlphaTauri
            {"name": "Yuki Tsunoda", "team_id": teams[7].id},
            {"name": "Daniel Ricciardo", "team_id": teams[7].id},
            # Alfa Romeo
            {"name": "Valtteri Bottas", "team_id": teams[8].id},
            {"name": "Zhou Guanyu", "team_id": teams[8].id},
            # Haas
            {"name": "Kevin Magnussen", "team_id": teams[9].id},
            {"name": "Nico Hulkenberg", "team_id": teams[9].id},
        ]
        
        drivers = []
        for driver_data in drivers_data:
            driver = Driver(**driver_data)
            db.add(driver)
            drivers.append(driver)
        
        db.commit()  # Commit to get IDs
        
        # Create Grand Prix events (full 2024 calendar)
        grand_prix_data = [
            {"name": "Bahrain Grand Prix", "year": 2024, "total_distance": 308, "total_laps": 57},
            {"name": "Saudi Arabian Grand Prix", "year": 2024, "total_distance": 308, "total_laps": 50},
            {"name": "Australian Grand Prix", "year": 2024, "total_distance": 306, "total_laps": 58},
            {"name": "Japanese Grand Prix", "year": 2024, "total_distance": 307, "total_laps": 53},
            {"name": "Chinese Grand Prix", "year": 2024, "total_distance": 305, "total_laps": 56},
            {"name": "Miami Grand Prix", "year": 2024, "total_distance": 308, "total_laps": 57},
            {"name": "Emilia Romagna Grand Prix", "year": 2024, "total_distance": 309, "total_laps": 63},
            {"name": "Monaco Grand Prix", "year": 2024, "total_distance": 260, "total_laps": 78},
            {"name": "Canadian Grand Prix", "year": 2024, "total_distance": 305, "total_laps": 70},
            {"name": "Spanish Grand Prix", "year": 2024, "total_distance": 308, "total_laps": 66},
            {"name": "Austrian Grand Prix", "year": 2024, "total_distance": 306, "total_laps": 71},
            {"name": "British Grand Prix", "year": 2024, "total_distance": 306, "total_laps": 52},
            {"name": "Hungarian Grand Prix", "year": 2024, "total_distance": 306, "total_laps": 70},
            {"name": "Belgian Grand Prix", "year": 2024, "total_distance": 308, "total_laps": 44},
            {"name": "Dutch Grand Prix", "year": 2024, "total_distance": 306, "total_laps": 72},
            {"name": "Italian Grand Prix", "year": 2024, "total_distance": 306, "total_laps": 53},
            {"name": "Singapore Grand Prix", "year": 2024, "total_distance": 309, "total_laps": 62},
            {"name": "United States Grand Prix", "year": 2024, "total_distance": 308, "total_laps": 56},
            {"name": "Mexican Grand Prix", "year": 2024, "total_distance": 305, "total_laps": 71},
            {"name": "Brazilian Grand Prix", "year": 2024, "total_distance": 305, "total_laps": 71},
            {"name": "Las Vegas Grand Prix", "year": 2024, "total_distance": 309, "total_laps": 50},
            {"name": "Qatar Grand Prix", "year": 2024, "total_distance": 308, "total_laps": 57},
            {"name": "Abu Dhabi Grand Prix", "year": 2024, "total_distance": 305, "total_laps": 58},
        ]
        
        grand_prix_list = []
        for gp_data in grand_prix_data:
            grand_prix = GrandPrix(**gp_data)
            db.add(grand_prix)
            grand_prix_list.append(grand_prix)
        
        db.commit()  # Commit to get IDs
        
        # Create users (multiple users for testing)
        users_data = [
            {
                "username": "admin",
                "email": "admin@f1strategies.com",
                "hashed_password": User.get_password_hash("admin123"),
                "role": UserRole.ADMIN
            },
            {
                "username": "f1_fan",
                "email": "fan@f1strategies.com",
                "hashed_password": User.get_password_hash("password123"),
                "role": UserRole.USER
            },
            {
                "username": "strategy_expert",
                "email": "expert@f1strategies.com",
                "hashed_password": User.get_password_hash("password123"),
                "role": UserRole.USER
            },
            {
                "username": "racing_analyst",
                "email": "analyst@f1strategies.com",
                "hashed_password": User.get_password_hash("password123"),
                "role": UserRole.USER
            },
            {
                "username": "testuser",
                "email": "test@example.com",
                "hashed_password": User.get_password_hash("password123"),
                "role": UserRole.USER
            }
        ]
        
        users = []
        for user_data in users_data:
            user = User(**user_data)
            db.add(user)
            users.append(user)
        
        db.commit()  # Commit to get user IDs
        
        # Create comprehensive strategies (30+ strategies for extensive testing)
        strategies_data = [
            # Monaco strategies
            {
                "title": "Monaco Conservative Strategy",
                "description": "Conservative approach for Monaco GP with minimal pit stops due to overtaking difficulty",
                "author_id": users[1].id,  # f1_fan
                "driver_id": drivers[0].id,  # Max Verstappen
                "team_id": teams[0].id,      # Red Bull Racing
                "grand_prix_id": grand_prix_list[7].id,  # Monaco GP
                "fuel_load": 110,
                "total_pit_stops": 1,
                "strategy_plan": [
                    {"lap": 35, "tire": "Hard", "fuel_added": 0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id  # admin
            },
            {
                "title": "Monaco Undercut Attempt",
                "description": "Risky early pit to gain track position in Monaco",
                "author_id": users[2].id,  # strategy_expert
                "driver_id": drivers[2].id,  # Lewis Hamilton
                "team_id": teams[1].id,      # Mercedes
                "grand_prix_id": grand_prix_list[7].id,  # Monaco GP
                "fuel_load": 105,
                "total_pit_stops": 1,
                "strategy_plan": [
                    {"lap": 25, "tire": "Medium", "fuel_added": 15.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            
            # Bahrain strategies
            {
                "title": "Bahrain Aggressive Two-Stop",
                "description": "Aggressive two-stop strategy for Bahrain with medium-hard compounds",
                "author_id": users[1].id,
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
                "approved_by_id": users[0].id
            },
            {
                "title": "Bahrain One-Stop Gamble",
                "description": "High-risk one-stop strategy banking on tire management",
                "author_id": users[3].id,  # racing_analyst
                "driver_id": drivers[1].id,  # Sergio Perez
                "team_id": teams[0].id,      # Red Bull Racing
                "grand_prix_id": grand_prix_list[0].id,  # Bahrain GP
                "fuel_load": 120,
                "total_pit_stops": 1,
                "strategy_plan": [
                    {"lap": 28, "tire": "Hard", "fuel_added": 0}
                ],
                "status": StrategyStatus.PENDING_APPROVAL
            },
            
            # Spanish GP strategies
            {
                "title": "Spanish GP Undercut Strategy",
                "description": "Early pit stop to undercut competitors at Circuit de Catalunya",
                "author_id": users[0].id,  # admin
                "driver_id": drivers[4].id,  # Charles Leclerc
                "team_id": teams[2].id,      # Ferrari
                "grand_prix_id": grand_prix_list[9].id,  # Spanish GP
                "fuel_load": 108,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 15, "tire": "Medium", "fuel_added": 30.0},
                    {"lap": 38, "tire": "Hard", "fuel_added": 22.5}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            {
                "title": "Spanish GP Alternative Strategy",
                "description": "Different tire compound strategy for Spain",
                "author_id": users[2].id,
                "driver_id": drivers[5].id,  # Carlos Sainz
                "team_id": teams[2].id,      # Ferrari
                "grand_prix_id": grand_prix_list[9].id,  # Spanish GP
                "fuel_load": 110,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 20, "tire": "Hard", "fuel_added": 28.0},
                    {"lap": 45, "tire": "Medium", "fuel_added": 18.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            
            # Miami GP strategies
            {
                "title": "McLaren One-Stop Gamble",
                "description": "Risky one-stop strategy banking on tire degradation",
                "author_id": users[1].id,
                "driver_id": drivers[6].id,  # Lando Norris
                "team_id": teams[3].id,      # McLaren
                "grand_prix_id": grand_prix_list[5].id,  # Miami GP
                "fuel_load": 115,
                "total_pit_stops": 1,
                "strategy_plan": [
                    {"lap": 28, "tire": "Hard", "fuel_added": 15.0}
                ],
                "status": StrategyStatus.REJECTED
            },
            {
                "title": "Miami Heat Strategy",
                "description": "Two-stop strategy optimized for Miami's heat conditions",
                "author_id": users[3].id,
                "driver_id": drivers[7].id,  # Oscar Piastri
                "team_id": teams[3].id,      # McLaren
                "grand_prix_id": grand_prix_list[5].id,  # Miami GP
                "fuel_load": 100,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 16, "tire": "Medium", "fuel_added": 32.0},
                    {"lap": 38, "tire": "Hard", "fuel_added": 24.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            
            # Silverstone strategies
            {
                "title": "British GP Weather Gamble",
                "description": "Strategy accounting for potential rain at Silverstone",
                "author_id": users[2].id,
                "driver_id": drivers[2].id,  # Lewis Hamilton
                "team_id": teams[1].id,      # Mercedes
                "grand_prix_id": grand_prix_list[11].id,  # British GP
                "fuel_load": 102,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 15, "tire": "Medium", "fuel_added": 30.0},
                    {"lap": 35, "tire": "Intermediate", "fuel_added": 20.0}
                ],
                "status": StrategyStatus.PENDING_APPROVAL
            },
            {
                "title": "Silverstone Home Victory Plan",
                "description": "Aggressive strategy for Hamilton's home race",
                "author_id": users[1].id,
                "driver_id": drivers[2].id,  # Lewis Hamilton
                "team_id": teams[1].id,      # Mercedes
                "grand_prix_id": grand_prix_list[11].id,  # British GP
                "fuel_load": 95,
                "total_pit_stops": 3,
                "strategy_plan": [
                    {"lap": 12, "tire": "Soft", "fuel_added": 25.0},
                    {"lap": 26, "tire": "Medium", "fuel_added": 22.0},
                    {"lap": 40, "tire": "Hard", "fuel_added": 18.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            
            # Monza strategies
            {
                "title": "Monza Slipstream Strategy",
                "description": "Low downforce setup with strategic slipstreaming",
                "author_id": users[3].id,
                "driver_id": drivers[4].id,  # Charles Leclerc
                "team_id": teams[2].id,      # Ferrari
                "grand_prix_id": grand_prix_list[15].id,  # Italian GP
                "fuel_load": 108,
                "total_pit_stops": 1,
                "strategy_plan": [
                    {"lap": 25, "tire": "Medium", "fuel_added": 20.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            
            # Spa strategies
            {
                "title": "Spa Weather Strategy",
                "description": "Multi-compound strategy for unpredictable Spa weather",
                "author_id": users[2].id,
                "driver_id": drivers[0].id,  # Max Verstappen
                "team_id": teams[0].id,      # Red Bull Racing
                "grand_prix_id": grand_prix_list[13].id,  # Belgian GP
                "fuel_load": 112,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 18, "tire": "Soft", "fuel_added": 28.0},
                    {"lap": 32, "tire": "Medium", "fuel_added": 22.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            
            # Singapore strategies
            {
                "title": "Singapore Night Race Endurance",
                "description": "Conservative strategy for the demanding Singapore circuit",
                "author_id": users[1].id,
                "driver_id": drivers[8].id,  # Pierre Gasly
                "team_id": teams[4].id,      # Alpine
                "grand_prix_id": grand_prix_list[16].id,  # Singapore GP
                "fuel_load": 115,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 22, "tire": "Medium", "fuel_added": 26.0},
                    {"lap": 45, "tire": "Hard", "fuel_added": 20.0}
                ],
                "status": StrategyStatus.PENDING_APPROVAL
            },
            
            # Additional strategies for different teams and drivers
            {
                "title": "Aston Martin Underdog Strategy",
                "description": "Point-scoring strategy for midfield battle",
                "author_id": users[4].id,  # testuser
                "driver_id": drivers[10].id,  # Fernando Alonso
                "team_id": teams[5].id,       # Aston Martin
                "grand_prix_id": grand_prix_list[3].id,  # Japanese GP
                "fuel_load": 108,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 20, "tire": "Medium", "fuel_added": 25.0},
                    {"lap": 38, "tire": "Hard", "fuel_added": 22.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            {
                "title": "Williams Points Hunt",
                "description": "Aggressive strategy to score rare points for Williams",
                "author_id": users[3].id,
                "driver_id": drivers[12].id,  # Alex Albon
                "team_id": teams[6].id,       # Williams
                "grand_prix_id": grand_prix_list[8].id,  # Canadian GP
                "fuel_load": 110,
                "total_pit_stops": 1,
                "strategy_plan": [
                    {"lap": 35, "tire": "Hard", "fuel_added": 15.0}
                ],
                "status": StrategyStatus.APPROVED,
                "approved_by_id": users[0].id
            },
            
            # Add more rejected strategies for testing
            {
                "title": "Unrealistic Four-Stop Strategy",
                "description": "Overly aggressive strategy with too many pit stops",
                "author_id": users[4].id,
                "driver_id": drivers[14].id,  # Yuki Tsunoda
                "team_id": teams[7].id,       # AlphaTauri
                "grand_prix_id": grand_prix_list[12].id,  # Hungarian GP
                "fuel_load": 80,
                "total_pit_stops": 4,
                "strategy_plan": [
                    {"lap": 10, "tire": "Soft", "fuel_added": 20.0},
                    {"lap": 20, "tire": "Medium", "fuel_added": 18.0},
                    {"lap": 35, "tire": "Hard", "fuel_added": 16.0},
                    {"lap": 50, "tire": "Soft", "fuel_added": 14.0}
                ],
                "status": StrategyStatus.REJECTED
            },
            
            # Las Vegas GP (new track)
            {
                "title": "Vegas Night Special",
                "description": "Strategy for the new Las Vegas night race",
                "author_id": users[2].id,
                "driver_id": drivers[3].id,  # George Russell
                "team_id": teams[1].id,      # Mercedes
                "grand_prix_id": grand_prix_list[20].id,  # Las Vegas GP
                "fuel_load": 106,
                "total_pit_stops": 2,
                "strategy_plan": [
                    {"lap": 16, "tire": "Medium", "fuel_added": 28.0},
                    {"lap": 34, "tire": "Hard", "fuel_added": 22.0}
                ],
                "status": StrategyStatus.PENDING_APPROVAL
            }
        ]
        
        for strategy_data in strategies_data:
            strategy = Strategy(**strategy_data)
            db.add(strategy)
        
        db.commit()
        print("Default data created successfully!")
        print(f"Created {len(teams)} teams")
        print(f"Created {len(drivers)} drivers")
        print(f"Created {len(grand_prix_list)} Grand Prix events")
        print(f"Created {len(users)} users")
        print(f"Created {len(strategies_data)} strategies")
        
    except Exception as e:
        print(f"Error creating default data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_default_data()