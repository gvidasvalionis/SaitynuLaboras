from pydantic import BaseModel, Field, validator
from typing import List, Optional

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    driver_ids: Optional[List[int]] = Field(default_factory=list)
    
    @validator("driver_ids")
    def validate_driver_count(cls, v):
        if len(v) > 2:
            raise ValueError("A team can have at most 2 drivers.")
        return v

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    driver_ids: Optional[List[int]] = None

    @validator("driver_ids")
    def validate_driver_count(cls, v):
        if v is not None and len(v) > 2:
            raise ValueError("A team can have at most 2 drivers.")
        return v

class DriverBasic(BaseModel):
    id: int
    name: str

class Team(TeamBase):
    id: int
    drivers: List[DriverBasic] = []

    class Config:
        from_attributes = True