from pydantic import BaseModel
from typing import List, Optional

class GrandPrixBase(BaseModel):
    name: str
    year: int

class GrandPrixCreate(GrandPrixBase):
    pass

class GrandPrixUpdate(BaseModel):
    name: Optional[str] = None
    year: Optional[int] = None

class GrandPrix(GrandPrixBase):
    id: int
    
    class Config:
        from_attributes = True