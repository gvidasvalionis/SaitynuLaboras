from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Strategy])
def read_strategies(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve strategies."""
    strategies = db.query(models.Strategy).offset(skip).limit(limit).all()
    return strategies


@router.post("/", response_model=schemas.Strategy)
def create_strategy(
    *,
    db: Session = Depends(get_db),
    strategy_in: schemas.StrategyCreate,
) -> Any:
    """Create new strategy."""
    strategy = models.Strategy(**strategy_in.dict())
    db.add(strategy)
    db.commit()
    db.refresh(strategy)
    return strategy


@router.get("/{strategy_id}", response_model=schemas.Strategy)
def read_strategy(
    *,
    db: Session = Depends(get_db),
    strategy_id: int,
) -> Any:
    """Get strategy by ID."""
    strategy = db.query(models.Strategy).filter(models.Strategy.id == strategy_id).first()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    return strategy


@router.put("/{strategy_id}", response_model=schemas.Strategy)
def update_strategy(
    *,
    db: Session = Depends(get_db),
    strategy_id: int,
    strategy_in: schemas.StrategyUpdate,
) -> Any:
    """Update a strategy."""
    strategy = db.query(models.Strategy).filter(models.Strategy.id == strategy_id).first()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    update_data = strategy_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(strategy, field, value)
    
    db.add(strategy)
    db.commit()
    db.refresh(strategy)
    return strategy


@router.delete("/{strategy_id}")
def delete_strategy(
    *,
    db: Session = Depends(get_db),
    strategy_id: int,
) -> Any:
    """Delete a strategy."""
    strategy = db.query(models.Strategy).filter(models.Strategy.id == strategy_id).first()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    db.delete(strategy)
    db.commit()
    return {"message": "Strategy deleted successfully"}