from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from src.database import Base

class Team(Base):
    __tablename__ = 'teams'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

    drivers = relationship("Driver", back_populates="team")
    strategies = relationship("Strategy", back_populates="team", cascade="all, delete-orphan")