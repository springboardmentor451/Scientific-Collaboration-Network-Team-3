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

    publication_type = Column(
        String(50),
        nullable=False,
        default="journal",
    )

    journal = Column(
        String(255),
        nullable=True,
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
        nullable=True,
    )

    keywords = Column(
        Text,
        nullable=True,
    )

    status = Column(
        String(20),
        nullable=False,
        default="draft",
    )

    pdf_filename = Column(
        String(255),
        nullable=True,
    )

    pdf_path = Column(
        String(500),
        nullable=True,
    )