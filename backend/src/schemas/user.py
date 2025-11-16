from typing import Optional
from enum import Enum

from pydantic import BaseModel, EmailStr, Field, ConfigDict, validator

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    password_confirm: str

    @validator('password')
    def password_complexity(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain a digit')
        return v
    
    @validator('password_confirm')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
    
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

    @validator('new_password')
    def new_password_complexity(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('New password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('New password must contain a digit')
        return v

    @validator('new_password')
    def new_password_different(cls, v, values):
        if 'current_password' in values and v == values['current_password']:
            raise ValueError('New password must be different from current password')
        return v
    
class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    model_config = ConfigDict(from_attributes=True)