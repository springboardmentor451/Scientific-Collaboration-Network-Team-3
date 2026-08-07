from sqlalchemy import Column, Integer, Float, ForeignKey
from app.database import Base


class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)

    researcher1_id = Column(
        Integer,
        ForeignKey("researchers.id"),
        nullable=False
    )

    researcher2_id = Column(
        Integer,
        ForeignKey("researchers.id"),
        nullable=False
    )

    collaboration_strength = Column(
        Float,
        default=1.0
    )