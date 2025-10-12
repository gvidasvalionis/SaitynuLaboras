from fastapi import APIRouter

from app.api.endpoints import strategies, teams, drivers, grand_prix, users

api_router = APIRouter()
api_router.include_router(strategies.router, prefix="/strategies", tags=["strategies"])
api_router.include_router(teams.router, prefix="/teams", tags=["teams"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(grand_prix.router, prefix="/grand_prix", tags=["grand_prix"])
api_router.include_router(users.router, prefix="/users", tags=["users"])