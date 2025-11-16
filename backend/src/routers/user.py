from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db_models import User
from src.schemas.user import UserCreate, UserResponse, PasswordChange
from src.database import get_db
from src.security import hash_password, verify_password, revoke_all_refresh_tokens
from src.auth import get_current_admin_user, get_current_user

router = APIRouter()

# ===== PUBLIC ROUTES (no authentication) =====

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or email already registered")
    
    hashed_pw = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
        role="user",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# ===== AUTHENTICATED USER ROUTES (operates on self) =====

@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return current_user

@router.put("/me/change_password", status_code=status.HTTP_200_OK)
def change_password(
    password_change: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):    
    if not verify_password(password_change.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    
    hashed_pw = hash_password(password_change.new_password)
    current_user.hashed_password = hashed_pw
    
    db.commit()

    revoke_all_refresh_tokens(db, current_user.id)
    return {"detail": "Password updated successfully"}

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.delete(current_user)
    db.commit()
    return None

# ===== ADMIN-ONLY ROUTES (operates on other users) =====

@router.get("/", response_model=list[Optional[UserResponse]], status_code=status.HTTP_200_OK)
def get_users(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    users = db.query(User).all()
    return users

@router.get("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    db.delete(user)
    db.commit()
    return None