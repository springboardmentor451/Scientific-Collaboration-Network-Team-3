from sqlalchemy import Column, Integer, String

from app.database import Base


class Citation(Base):
    __tablename__ = "citations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    authors = Column(
        String(255),
        nullable=False,
    )

    year = Column(
        Integer,
        nullable=False,
    )

    journal = Column(
        String(255),
        nullable=False,
    )

    doi = Column(
        String(255),
        nullable=True,
    )
