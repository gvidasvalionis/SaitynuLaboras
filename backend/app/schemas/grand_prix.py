from pydantic import BaseModel
from typing import List, Optional

class GrandPrixBase(BaseModel):
    name: str
    year: int
    total_distance: int
    total_laps: int

class GrandPrixCreate(GrandPrixBase):
    pass

class GrandPrixUpdate(BaseModel):
    name: Optional[str] = None
    year: Optional[int] = None
    total_distance: Optional[int] = None
    total_laps: Optional[int] = None

class GrandPrix(GrandPrixBase):
    id: int
    
    class Config:
        from_attributes = True

class StrategyNested(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    fuel_load: Optional[int] = None
    total_pit_stops: int
    status: str

    class Config:
        from_attributes = True

class DriverNested(BaseModel):
    id: int
    name: str
    strategies: List[StrategyNested] = []
    
    class Config:
        from_attributes = True

class TeamNested(BaseModel):
    id: int
    name: str
    drivers: List[DriverNested] = []
    
    class Config:
        from_attributes = True

class GrandPrixWithHierarchy(GrandPrix):
    teams: List[TeamNested] = []
    
    class Config:
        from_attributes = True