from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from datetime import datetime, timezone

from app.database import Base

class StrategyStatus(PyEnum):
    PENDING_APPROVAL = "Pending Approval"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class Strategy(Base):
    __tablename__ = "strategies"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    
    # Foreign Keys
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    grand_prix_id = Column(Integer, ForeignKey("grand_prix.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    
    # Details
    fuel_load = Column(Integer)  # bendras degalu kiekis (litrais)
    total_pit_stops = Column(Integer, default=1) # planuojamas sustojimu skaicius
    strategy_plan = Column(JSON)
    # JSON laukas, pvz.:
    # [
    #   {"lap": 12, "tire": "Medium", "fuel_added": 20.5},
    #   {"lap": 32, "tire": "Hard", "fuel_added": 15.0}
    # ]
    
    status = Column(Enum(StrategyStatus), default=StrategyStatus.PENDING_APPROVAL)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    approved_at = Column(DateTime)
    approved_by_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    author = relationship("User", back_populates="strategies", foreign_keys=[author_id])
    approved_by = relationship("User", back_populates="approved_strategies", foreign_keys=[approved_by_id])
    grand_prix = relationship("GrandPrix", back_populates="strategies")
    team = relationship("Team", back_populates="strategies")
    driver = relationship("Driver", back_populates="strategies")