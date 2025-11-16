from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship

from src.database import Base

class Strategy(Base):
    __tablename__ = 'strategies'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    parameters = Column(JSON, nullable=False)
    approved = Column(Boolean, default=False, nullable=False)
    grand_prix_id = Column(Integer, ForeignKey('grand_prix.id'), nullable=False)
    driver_id = Column(Integer, ForeignKey('drivers.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id'), nullable=False)

    grand_prix = relationship("GrandPrix", back_populates="strategies")
    team = relationship("Team", back_populates="strategies")
    driver = relationship("Driver", back_populates="strategies")
    user = relationship("User", back_populates="strategies")