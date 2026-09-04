from sqlalchemy import Column, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database import Base


class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    researcher1_id = Column(
        Integer,
        ForeignKey("researchers.id"),
        nullable=False,
    )

    researcher2_id = Column(
        Integer,
        ForeignKey("researchers.id"),
        nullable=False,
    )

    collaboration_strength = Column(
        Float,
        nullable=True,
    )

    # Relationships
    researcher1 = relationship(
        "Researcher",
        foreign_keys=[researcher1_id],
        backref="collaborations_as_r1",
    )

    researcher2 = relationship(
        "Researcher",
        foreign_keys=[researcher2_id],
        backref="collaborations_as_r2",
    )
