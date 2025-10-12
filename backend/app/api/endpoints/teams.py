from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Team])
def read_teams(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve teams."""
    teams = db.query(models.Team).offset(skip).limit(limit).all()
    return teams


@router.post("/", response_model=schemas.Team)
def create_team(
    *,
    db: Session = Depends(get_db),
    team_in: schemas.TeamCreate,
) -> Any:
    """Create new team."""
    team = models.Team(**team_in.dict())
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@router.get("/{team_id}", response_model=schemas.Team)
def read_team(
    *,
    db: Session = Depends(get_db),
    team_id: int,
) -> Any:
    """Get team by ID."""
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.put("/{team_id}", response_model=schemas.Team)
def update_team(
    *,
    db: Session = Depends(get_db),
    team_id: int,
    team_in: schemas.TeamUpdate,
) -> Any:
    """Update a team."""
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    update_data = team_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(team, field, value)
    
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@router.delete("/{team_id}")
def delete_team(
    *,
    db: Session = Depends(get_db),
    team_id: int,
) -> Any:
    """Delete a team."""
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    db.delete(team)
    db.commit()
    return {"message": "Team deleted successfully"}