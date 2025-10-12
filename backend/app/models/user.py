from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from datetime import datetime, timezone

from app.database import Base

class UserRole(PyEnum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships
    strategies = relationship("Strategy", back_populates="author", foreign_keys="Strategy.author_id", cascade="all, delete-orphan")
    approved_strategies = relationship("Strategy", back_populates="approved_by", foreign_keys="Strategy.approved_by_id", cascade="all, delete-orphan")