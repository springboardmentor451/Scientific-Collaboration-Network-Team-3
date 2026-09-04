from sqlalchemy import Column, Integer, String

from app.database import Base


class Conference(Base):
    __tablename__ = "conferences"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(255),
        nullable=False,
    )

    acronym = Column(
        String(50),
        nullable=True,
    )

    year = Column(
        Integer,
        nullable=False,
    )

    location = Column(
        String(255),
        nullable=False,
    )

    organizer = Column(
        String(255),
        nullable=False,
    )

    website = Column(
        String(255),
        nullable=True,
    )
