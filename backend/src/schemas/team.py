from pydantic import BaseModel, Field, ConfigDict

class TeamBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    
class TeamCreate(TeamBase):
    pass

class TeamResponse(TeamBase):
    id: int
    model_config = ConfigDict(from_attributes=True)