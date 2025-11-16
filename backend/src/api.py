from fastapi import APIRouter

import src.routers as routers

api_router = APIRouter()

api_router.include_router(routers.user_router, prefix="/users", tags=["users"])
api_router.include_router(routers.auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(routers.driver_router, prefix="/drivers", tags=["drivers"])
api_router.include_router(routers.team_router, prefix="/teams", tags=["teams"])
api_router.include_router(routers.strategy_router, prefix="/strategies", tags=["strategies"])
api_router.include_router(routers.grand_prix_router, prefix="/grand_prix", tags=["grand_prix"])