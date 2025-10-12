from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Driver])
def read_drivers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve drivers."""
    drivers = db.query(models.Driver).offset(skip).limit(limit).all()
    return drivers


@router.post("/", response_model=schemas.Driver)
def create_driver(
    *,
    db: Session = Depends(get_db),
    driver_in: schemas.DriverCreate,
) -> Any:
    """Create new driver."""
    driver = models.Driver(**driver_in.dict())

    team_does_not_exist = not (
        db.query(models.Team)
        .filter(models.Team.id == driver_in.team_id)
        .first()
    )

    if team_does_not_exist and driver_in.team_id is not None:
        raise HTTPException(status_code=400, detail="Team does not exist.")
    
    if (
        db.query(models.Driver)
        .filter(models.Driver.team_id == driver_in.team_id)
        .count() >= 2
    ):
        raise HTTPException(status_code=400, detail="Team already has 2 drivers.")

    db.add(driver)
    db.commit()
    db.refresh(driver)
    return driver


@router.get("/{driver_id}", response_model=schemas.Driver)
def read_driver(
    *,
    db: Session = Depends(get_db),
    driver_id: int,
) -> Any:
    """Get driver by ID."""
    driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver


@router.put("/{driver_id}", response_model=schemas.Driver)
def update_driver(
    *,
    db: Session = Depends(get_db),
    driver_id: int,
    driver_in: schemas.DriverUpdate,
) -> Any:
    """Update a driver."""
    driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    update_data = driver_in.dict(exclude_unset=True)
    
    if "name" in update_data:
        driver.name = update_data["name"]

    if "team_id" in update_data:
        if not (
            db.query(models.Team)
            .filter(models.Team.id == update_data["team_id"])
            .first()
        ):
            raise HTTPException(status_code=400, detail="Team does not exist.")

        if (
            db.query(models.Driver)
            .filter(models.Driver.team_id == update_data["team_id"])
            .count() >= 2
        ):
            raise HTTPException(status_code=400, detail="Team already has 2 drivers.")

        driver.team_id = update_data["team_id"]
    
    db.add(driver)
    db.commit()
    db.refresh(driver)
    return driver


@router.delete("/{driver_id}")
def delete_driver(
    *,
    db: Session = Depends(get_db),
    driver_id: int,
) -> Any:
    """Delete a driver."""
    driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    db.delete(driver)
    db.commit()
    return {"message": "Driver deleted successfully"}