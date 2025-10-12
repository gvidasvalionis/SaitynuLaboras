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
    team = models.Team(**team_in.dict(exclude={'driver_ids'}))
    db.add(team)
    db.flush()

    if team_in.driver_ids:
        if len(team_in.driver_ids) > 2:
            raise HTTPException(status_code=400, detail="A team can have at most 2 drivers.")
        
        drivers = (
            db.query(models.Driver)
            .filter(models.Driver.id.in_(team_in.driver_ids))
            .all()
        )

        if len(drivers) != len(team_in.driver_ids):
            raise HTTPException(status_code=400, detail="One or more drivers not found.")
        
        already_assigned = [d for d in drivers if d.team_id is not None]
        if already_assigned:
            assigned_names = ", ".join(d.name for d in already_assigned)
            raise HTTPException(
                status_code=400,
                detail=f"Drivers already assigned to another team: {assigned_names}",
            )

        # Assign them to the new team
        for driver in drivers:
            driver.team_id = team.id

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
    
    if "name" in update_data:
        team.name = update_data["name"]

    if "driver_ids" in update_data:
        new_driver_ids = update_data["driver_ids"] or []
        if len(new_driver_ids) > 2:
            raise HTTPException(status_code=400, detail="A team can have at most 2 drivers.")
        
        current_drivers = (
            db.query(models.Driver)
            .filter(models.Driver.team_id == team.id)
            .all()
        )

        for driver in current_drivers:
            driver.team_id = None

        if new_driver_ids:
            drivers = (
                db.query(models.Driver)
                .filter(models.Driver.id.in_(new_driver_ids))
                .all()
            )

            if len(drivers) != len(new_driver_ids):
                raise HTTPException(status_code=404, detail="One or more drivers not found.")

            for driver in drivers:
                # Prevent assigning a driver already in another team
                if driver.team_id and driver.team_id != team.id:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Driver '{driver.name}' already belongs to another team.",
                    )
                driver.team_id = team.id

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