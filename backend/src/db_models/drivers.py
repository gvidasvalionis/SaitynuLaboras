from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from src.database import Base

class Driver(Base):
    __tablename__ = 'drivers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    team_id = Column(Integer, nullable=True)

    team = relationship("Team", back_populates="drivers")
    strategies = relationship("Strategy", back_populates="driver", cascade="all, delete-orphan")