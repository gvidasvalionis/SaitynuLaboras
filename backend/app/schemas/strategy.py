from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class StrategyStatus(str, Enum):
    PENDING_APPROVAL = "Pending Approval"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class StrategyBase(BaseModel):
    title: str
    description: Optional[str] = None
    driver_id: int
    team_id: int
    grand_prix_id: int
    fuel_load: Optional[int] = None
    total_pit_stops: int = 1
    strategy_plan: Optional[List[Dict[str, Any]]] = None

class StrategyCreate(StrategyBase):
    author_id: int

class StrategyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    fuel_load: Optional[int] = None
    total_pit_stops: Optional[int] = None
    strategy_plan: Optional[List[Dict[str, Any]]] = None
    status: Optional[StrategyStatus] = None

class Strategy(StrategyBase):
    id: int
    author_id: int
    status: StrategyStatus
    created_at: datetime
    updated_at: datetime
    approved_at: Optional[datetime] = None
    approved_by_id: Optional[int] = None
    
    class Config:
        from_attributes = True