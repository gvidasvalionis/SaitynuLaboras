from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db_models import Strategy
from src.schemas.strategy import StrategyCreate, StrategyResponse, StrategyUpdate
from src.database import get_db
from src.auth import get_current_user, get_current_admin_user

router = APIRouter()

# ===== AUTHENTICATED USER ROUTES =====

@router.get("/by-user-all", response_model=list[Optional[StrategyResponse]], status_code=status.HTTP_200_OK)
def list_strategies(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    strategies = db.query(Strategy).filter(Strategy.user_id == current_user.id).all()
    return strategies

@router.get("/by-user", response_model=list[StrategyResponse], status_code=status.HTTP_200_OK)
def list_user_strategies(
    grand_prix_id: int,
    driver_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not permitted")
    
    strategies = (
        db.query(Strategy)
        .filter(
            Strategy.user_id == user_id,
            Strategy.grand_prix_id == grand_prix_id,
            Strategy.driver_id == driver_id,
        )
        .all()
    )
    return strategies

@router.post("/me", response_model=StrategyResponse, status_code=status.HTTP_201_CREATED)
def create_strategy(
    strategy: StrategyCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    new_strategy = Strategy(
        name=strategy.name,
        description=strategy.description,
        parameters=strategy.parameters,
        approved=False,
        grand_prix_id=strategy.grand_prix_id,
        driver_id=strategy.driver_id,
        user_id=current_user.id,
        team_id=strategy.team_id,
    )
    db.add(new_strategy)
    db.commit()
    db.refresh(new_strategy)
    return new_strategy

@router.get("/me/{strategy_id}", response_model=StrategyResponse, status_code=status.HTTP_200_OK)
def get_user_strategy(
    strategy_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    strategy = db.query(Strategy).filter(
        Strategy.id == strategy_id, 
        Strategy.user_id == current_user.id
    ).first()
    
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Strategy not found or you don't have permission to view it"
        )
    
    return strategy

@router.put("/me/{strategy_id}", response_model=StrategyResponse, status_code=status.HTTP_200_OK)
def update_strategy(
    strategy_id: int,
    strategy_update: StrategyUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id, Strategy.user_id == current_user.id).first()
    if not strategy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    
    if strategy_update.name is not None:
        strategy.name = strategy_update.name
    if strategy_update.description is not None:
        strategy.description = strategy_update.description
    if strategy_update.parameters is not None:
        strategy.parameters = strategy_update.parameters
    
    db.commit()
    db.refresh(strategy)
    return strategy

@router.delete("/me/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_strategy(
    strategy_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id, Strategy.user_id == current_user.id).first()
    if not strategy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    
    db.delete(strategy)
    db.commit()
    return None

# ===== ADMIN ROUTES =====

@router.get("/", response_model=list[Optional[StrategyResponse]], status_code=status.HTTP_200_OK)
def list_strategies(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    strategies = db.query(Strategy).all()
    return strategies

@router.put("/{strategy_id}/approve", response_model=StrategyResponse, status_code=status.HTTP_200_OK)
def approve_strategy(
    strategy_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin_user),
):
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if not strategy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    
    strategy.approved = True
    db.commit()
    db.refresh(strategy)
    return strategy

@router.delete("/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_strategy(
    strategy_id: int,
    db: Session = Depends(get_db),
    current_admin: Strategy = Depends(get_current_admin_user),
):
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if not strategy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    
    db.delete(strategy)
    db.commit()
    return None
