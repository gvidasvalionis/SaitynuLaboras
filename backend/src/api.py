from fastapi import APIRouter

import src.routers as routers

api_router = APIRouter()

api_router.include_router(routers.user_router, prefix="/users", tags=["users"])
api_router.include_router(routers.auth_router, prefix="/auth", tags=["auth"])