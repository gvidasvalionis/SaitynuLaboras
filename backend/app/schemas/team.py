from pydantic import BaseModel
from typing import List, Optional

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None

# Forward reference for Driver
class DriverBasic(BaseModel):
    id: int
    name: str

class Team(TeamBase):
    id: int
    drivers: List[DriverBasic] = []

    class Config:
        from_attributes = True