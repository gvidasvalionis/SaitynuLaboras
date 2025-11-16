from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator
from typing import List, Dict, Any 

valid_tire_compounds = ["Soft", "Medium", "Hard", "Intermediate", "Wet"]
valid_components = ["tire_strategy", "fuel_management", "pit_stop_timing", "aerodynamics_setup"]

class StrategyBase(BaseModel):
    name: str
    description: str = Field(default="", max_length=500)
    parameters: dict = Field(..., description="Strategy parameters in JSON format")

    @field_validator('parameters')
    def validate_parameters(cls, v):
        if not v or not v.strip():
            raise ValueError('Parameters cannot be empty')
        return v.strip()
    
    @field_validator('parameters')
    @classmethod
    def validate_parameters(cls, v: dict) -> dict:
        if not isinstance(v, dict):
            raise ValueError("Parameters must be a dictionary")
        
        # Check for required keys
        required_keys = ["pit_stops"]
        for key in required_keys:
            if key not in v:
                raise ValueError(f"Parameters must contain '{key}'")
        
        # Validate pit stops
        pit_stops = v.get("pit_stops", [])
        if not isinstance(pit_stops, list):
            raise ValueError("pit_stops must be a list")
        
        if not pit_stops or len(pit_stops) < 1:
            raise ValueError("Strategy must include at least 1 pit stop")
        
        if len(pit_stops) > 5:
            raise ValueError("Strategy cannot have more than 5 pit stops")
        
        # Validate each pit stop
        previous_lap = 0
        for idx, stop in enumerate(pit_stops):
            if not isinstance(stop, dict):
                raise ValueError(f"Pit stop {idx + 1} must be a dictionary")
            
            if "lap" not in stop:
                raise ValueError(f"Pit stop {idx + 1} must have a 'lap' field")
            
            if "tire" not in stop:
                raise ValueError(f"Pit stop {idx + 1} must have a 'tire' field")
            
            lap = stop["lap"]
            tire = stop["tire"]
            
            # Validate lap number
            if not isinstance(lap, int) or lap < 1:
                raise ValueError(f"Pit stop {idx + 1}: lap must be a positive integer")
            
            if lap <= previous_lap:
                raise ValueError(f"Pit stop {idx + 1}: laps must be in ascending order")
            
            if lap == 1:
                raise ValueError("First pit stop cannot be on lap 1")
            
            previous_lap = lap
            
            # Validate tire compound
            if tire not in valid_tire_compounds:
                raise ValueError(
                    f"Pit stop {idx + 1}: tire compound must be one of {valid_tire_compounds}"
                )
        
        # Validate fuel load if present
        if "fuel_load" in v:
            fuel_load = v["fuel_load"]
            if not isinstance(fuel_load, (int, float)):
                raise ValueError("fuel_load must be a number")
            if fuel_load < 0 or fuel_load > 110:
                raise ValueError("fuel_load must be between 0 and 110 kg")
        
        # Validate fuel strategy percentages if present
        if "fuel_strategy" in v:
            fuel_strategy = v["fuel_strategy"]
            if isinstance(fuel_strategy, dict):
                for key, value in fuel_strategy.items():
                    if isinstance(value, (int, float)):
                        if value < 0 or value > 100:
                            raise ValueError(f"fuel_strategy.{key} must be between 0 and 100")
        
        return v

class StrategyCreate(StrategyBase):
    grand_prix_id: int
    driver_id: int
    user_id: int

    @field_validator('grand_prix_id', 'driver_id', 'user_id')
    @classmethod
    def id_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('ID must be a positive integer')
        return v

class StrategyResponse(StrategyBase):
    id: int
    approved: bool
    grand_prix_id: int
    driver_id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class StrategyUpdate(BaseModel):
    name: str | None = Field(None, min_length=3, max_length=100)
    description: str | None = Field(None, max_length=500)
    parameters: dict | None = None

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        if v is not None:
            if not v or not v.strip():
                raise ValueError("Name cannot be empty or whitespace only")
            return v.strip()
        return v

    @field_validator('parameters')
    @classmethod
    def validate_parameters(cls, v: dict | None) -> dict | None:
        if v is not None:
            return StrategyBase.model_validate({"name": "temp", "parameters": v}).parameters
        return v