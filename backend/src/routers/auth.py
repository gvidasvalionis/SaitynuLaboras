from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.auth import (
    create_access_token,
    create_refresh_token, 
    authenticate_user,
    verify_refresh_token,
    revoke_refresh_token,
)
from src.database import get_db
from src.schemas.auth import Token, RefreshTokenRequest

router = APIRouter()

@router.post("/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    refresh_token = create_refresh_token(db, user.id)

    return {
        "access_token": access_token, 
        "refresh_token": refresh_token, 
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
def refresh_access_token(
    refresh_request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    user = verify_refresh_token(db, refresh_request.refresh_token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})

    return {
        "access_token": access_token,
        "refresh_token": refresh_request.refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout(
    refresh_request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    revoked = revoke_refresh_token(db, refresh_request.refresh_token)
    if not revoked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token not found",
        )
    
    return {"detail": "Successfully logged out"}