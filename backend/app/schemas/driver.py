from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DriverBase(BaseModel):
    name: str
    team_id: int

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    team_id: Optional[int] = None

# Forward reference for Team
class TeamBasic(BaseModel):
    id: int
    name: str

class Driver(DriverBase):
    id: int
    team: Optional[TeamBasic] = None
    
    class Config:
        from_attributes = True