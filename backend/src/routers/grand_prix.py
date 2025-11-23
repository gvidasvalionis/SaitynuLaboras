from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db_models import GrandPrix
from src.schemas.grand_prix import GrandPrixCreate, GrandPrixResponse
from src.database import get_db
from src.auth import get_current_admin_user

router = APIRouter()

# ===== PUBLIC ROUTES (no authentication) =====

@router.get("/", response_model=list[Optional[GrandPrixResponse]], status_code=status.HTTP_200_OK)
def get_all_grand_prix(
    db: Session = Depends(get_db),
):
    grand_prix_list = db.query(GrandPrix).all()
    return grand_prix_list

@router.get("/{grand_prix_id}", response_model=GrandPrixResponse, status_code=status.HTTP_200_OK)
def get_grand_prix(
    grand_prix_id: int,
    db: Session = Depends(get_db),
):
    grand_prix = db.query(GrandPrix).filter(GrandPrix.id == grand_prix_id).first()
    if not grand_prix:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grand Prix not found.",
        )
    return grand_prix

# ===== ADMIN ROUTES =====

@router.post("/", response_model=GrandPrixResponse, status_code=status.HTTP_201_CREATED)
def create_grand_prix(
    grand_prix: GrandPrixCreate,
    db: Session = Depends(get_db),
    current_admin: GrandPrix = Depends(get_current_admin_user),
):
    db_grand_prix = db.query(GrandPrix).filter(GrandPrix.name == grand_prix.name).first()
    if db_grand_prix:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Grand Prix with this name already exists.",
        )
    
    new_grand_prix = GrandPrix(
        name=grand_prix.name,
        year=grand_prix.year,
    )

    db.add(new_grand_prix)
    db.commit()
    db.refresh(new_grand_prix)
    return new_grand_prix

@router.delete("/{grand_prix_id}", status_code=status.HTTP_200_OK)
def delete_grand_prix(
    grand_prix_id: int,
    db: Session = Depends(get_db),
    current_admin: GrandPrix = Depends(get_current_admin_user),
):
    grand_prix = db.query(GrandPrix).filter(GrandPrix.id == grand_prix_id).first()
    if not grand_prix:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grand Prix not found.",
        )
    
    db.delete(grand_prix)
    db.commit()
    return {"detail": "Grand Prix deleted successfully"}