from sqlalchemy import Column, Integer, String, Boolean, JSON
from sqlalchemy.orm import relationship

from src.database import Base

class Strategy(Base):
    __tablename__ = 'strategies'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    parameters = Column(JSON, nullable=False)
    approved = Column(Boolean, default=False, nullable=False)
    grand_prix_id = Column(Integer, nullable=False)
    driver_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)


    driver = relationship("Driver", back_populates="strategies")
    user = relationship("User", back_populates="strategies")