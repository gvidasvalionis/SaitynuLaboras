from enum import Enum

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from src.database import Base

class UserRole(str, Enum):
    admin = "admin"
    user = "user"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.user.value, nullable=False)

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    strategies = relationship("Strategy", back_populates="user", cascade="all, delete-orphan")