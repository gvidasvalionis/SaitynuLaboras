from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base

class GrandPrix(Base):
    __tablename__ = "grand_prix"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)

    # Relationships
    strategies = relationship("Strategy", back_populates="grand_prix")