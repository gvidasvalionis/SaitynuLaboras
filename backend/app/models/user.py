from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from datetime import datetime, timezone
import bcrypt

from app.database import Base

class UserRole(PyEnum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships
    strategies = relationship("Strategy", back_populates="author", foreign_keys="Strategy.author_id", cascade="all, delete-orphan")
    approved_strategies = relationship("Strategy", back_populates="approved_by", foreign_keys="Strategy.approved_by_id", cascade="all, delete-orphan")

    def verify_password(self, password: str) -> bool:
        """Verify a password against the hash"""
        # Truncate password if longer than 72 bytes
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        
        return bcrypt.checkpw(password.encode('utf-8'), self.hashed_password.encode('utf-8'))
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Generate password hash"""
        # Truncate password if longer than 72 bytes
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')