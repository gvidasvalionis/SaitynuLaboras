from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


from app.database import Base

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    
    # Relationships
    drivers = relationship("Driver", back_populates="team", cascade="all, delete-orphan")
    strategies = relationship("Strategy", back_populates="team", cascade="all, delete-orphan")