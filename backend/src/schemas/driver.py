from pydantic import BaseModel, Field, ConfigDict

class DriverBase(BaseModel):
    name: str = Field(..., pattern="^[A-Za-zÀ-ÖØ-öø-ÿ '-]+$", max_length=100)
    surname: str = Field(..., pattern="^[A-Za-zÀ-ÖØ-öø-ÿ '-]+$", max_length=100)
    team_id: int = Field(default=None)

class DriverCreate(DriverBase):
    pass

class DriverResponse(DriverBase):
    id: int
    model_config = ConfigDict(from_attributes=True)