# Publication model — journal papers, conference papers, books, patents, reports; status: draft/submitted/published/archived
from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class Publication(Base):
    __tablename__ = "publications"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(300),
        nullable=False,
    )

    authors = Column(
        Text,
        nullable=False,
    )

    journal = Column(
        String(255),
        nullable=False,
    )

    year = Column(
        Integer,
        nullable=False,
    )

    doi = Column(
        String(255),
        unique=True,
        nullable=False,
    )

    abstract = Column(
        Text,
    )

    keywords = Column(
        Text,
    )