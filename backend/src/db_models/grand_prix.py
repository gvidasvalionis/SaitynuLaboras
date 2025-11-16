from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from src.database import Base

class GrandPrix(Base):
    __tablename__ = 'grand_prix'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    year = Column(Integer, nullable=False)

    strategies = relationship("Strategy", back_populates="grand_prix", cascade="all, delete-orphan")