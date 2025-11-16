from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db_models import Team
from src.schemas.team import TeamCreate, TeamResponse
from src.database import get_db
from src.auth import get_current_admin_user


router = APIRouter()

# ===== PUBLIC ROUTES (no authentication) =====

@router.get("/", response_model=list[Optional[TeamResponse]], status_code=status.HTTP_200_OK)
def get_teams(
    db: Session = Depends(get_db),
):
    teams = db.query(Team).all()
    return teams

# ===== ADMIN ROUTES (admin authentication required) =====

@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_admin: Team = Depends(get_current_admin_user),
):
    db_team = db.query(Team).filter(Team.name == team.name).first()
    if db_team:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team name already exists")
    
    new_team = Team(
        name=team.name,
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team

@router.delete("/{team_id}", status_code=status.HTTP_200_OK)
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_admin: Team = Depends(get_current_admin_user),
):
    db_team = db.query(Team).filter(Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    
    db.delete(db_team)
    db.commit()
    return {"detail": "Team deleted successfully"}