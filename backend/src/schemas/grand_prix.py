from pydantic import BaseModel, Field, ConfigDict

class GrandPrixBase(BaseModel):
    name: str
    year: int = Field(..., ge=1900, le=2100)

class GrandPrixCreate(GrandPrixBase):
    pass

class GrandPrixResponse(GrandPrixBase):
    id: int
    model_config = ConfigDict(from_attributes=True)