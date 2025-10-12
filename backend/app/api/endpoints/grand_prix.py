from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app import models, schemas
from app.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.GrandPrix])
def read_grand_prix(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve grand prix."""
    grand_prix = db.query(models.GrandPrix).offset(skip).limit(limit).all()
    return grand_prix

@router.get("/hierarchy", response_model=List[schemas.GrandPrixWithHierarchy])
def get_all_grand_prix_hierarchy(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Get all Grand Prix with full hierarchy: Teams -> Drivers -> Strategies."""
    grand_prix_list = db.query(models.GrandPrix).offset(skip).limit(limit).all()
    
    result = []
    for grand_prix in grand_prix_list:
        # Get all teams that have strategies for this Grand Prix
        teams_with_strategies = (
            db.query(models.Team)
            .join(models.Strategy, models.Team.id == models.Strategy.team_id)
            .filter(models.Strategy.grand_prix_id == grand_prix.id)
            .options(
                joinedload(models.Team.drivers).joinedload(models.Driver.strategies)
            )
            .distinct()
            .all()
        )
        
        # Filter strategies by Grand Prix and organize the hierarchy
        hierarchy_teams = []
        for team in teams_with_strategies:
            team_drivers = []
            for driver in team.drivers:
                # Filter strategies for this Grand Prix and driver
                driver_strategies = [
                    strategy for strategy in driver.strategies 
                    if strategy.grand_prix_id == grand_prix.id
                ]
                
                if driver_strategies:  # Only include drivers with strategies
                    team_drivers.append({
                        "id": driver.id,
                        "name": driver.name,
                        "strategies": driver_strategies
                    })
            
            if team_drivers:  # Only include teams with drivers that have strategies
                hierarchy_teams.append({
                    "id": team.id,
                    "name": team.name,
                    "drivers": team_drivers
                })
        
        result.append({
            **grand_prix.__dict__,
            "teams": hierarchy_teams
        })
    
    return result


@router.post("/", response_model=schemas.GrandPrix)
def create_grand_prix(
    *,
    db: Session = Depends(get_db),
    grand_prix_in: schemas.GrandPrixCreate,
) -> Any:
    """Create new grand prix."""
    grand_prix = models.GrandPrix(**grand_prix_in.dict())
    db.add(grand_prix)
    db.commit()
    db.refresh(grand_prix)
    return grand_prix


@router.get("/{grand_prix_id}", response_model=schemas.GrandPrix)
def read_grand_prix_by_id(
    *,
    db: Session = Depends(get_db),
    grand_prix_id: int,
) -> Any:
    """Get grand prix by ID."""
    grand_prix = db.query(models.GrandPrix).filter(models.GrandPrix.id == grand_prix_id).first()
    if not grand_prix:
        raise HTTPException(status_code=404, detail="Grand Prix not found")
    return grand_prix


@router.put("/{grand_prix_id}", response_model=schemas.GrandPrix)
def update_grand_prix(
    *,
    db: Session = Depends(get_db),
    grand_prix_id: int,
    grand_prix_in: schemas.GrandPrixUpdate,
) -> Any:
    """Update a grand prix."""
    grand_prix = db.query(models.GrandPrix).filter(models.GrandPrix.id == grand_prix_id).first()
    if not grand_prix:
        raise HTTPException(status_code=404, detail="Grand Prix not found")
    
    update_data = grand_prix_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(grand_prix, field, value)
    
    db.add(grand_prix)
    db.commit()
    db.refresh(grand_prix)
    return grand_prix


@router.delete("/{grand_prix_id}")
def delete_grand_prix(
    *,
    db: Session = Depends(get_db),
    grand_prix_id: int,
) -> Any:
    """Delete a grand prix."""
    grand_prix = db.query(models.GrandPrix).filter(models.GrandPrix.id == grand_prix_id).first()
    if not grand_prix:
        raise HTTPException(status_code=404, detail="Grand Prix not found")
    
    db.delete(grand_prix)
    db.commit()
    return {"message": "Grand Prix deleted successfully"}
