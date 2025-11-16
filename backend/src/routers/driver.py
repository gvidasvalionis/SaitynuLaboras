from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db_models import Driver
from src.schemas.driver import DriverCreate, DriverResponse
from src.database import get_db
from src.auth import get_current_admin_user

router = APIRouter()

# ===== PUBLIC ROUTES (no authentication) =====

@router.get("/", response_model=list[DriverResponse], status_code=status.HTTP_200_OK)
def list_drivers(
    db: Session = Depends(get_db),
):
    drivers = db.query(Driver).all()
    return drivers

# ===== ADMIN ROUTES =====

@router.post("/", response_model=DriverResponse, status_code=status.HTTP_201_CREATED)
def create_driver(
    driver: DriverCreate,
    db: Session = Depends(get_db),
    current_admin: Driver = Depends(get_current_admin_user),
):
    new_driver = Driver(
        name=driver.name,
        surname=driver.surname,
        team_id=driver.team_id,
    )
    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)
    return new_driver

@router.delete("/{driver_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    current_admin: Driver = Depends(get_current_admin_user),
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver not found")
    
    db.delete(driver)
    db.commit()
    return