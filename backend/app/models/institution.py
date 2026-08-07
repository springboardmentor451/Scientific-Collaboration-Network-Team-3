# Institution model — institution management, departments
from sqlalchemy import Column, Integer, String

from app.database import Base


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)

    city = Column(String(150), nullable=False)

    state = Column(String(150), nullable=False)

    country = Column(String(150), nullable=False)

    website = Column(String(255))