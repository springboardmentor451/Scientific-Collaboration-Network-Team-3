from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

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

    # Kept for display / backward compatibility
    authors = Column(
        Text,
        nullable=False,
    )

    publication_type = Column(
        String(50),
        nullable=False,
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
        nullable=False,
        unique=True,
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
    )

    pdf_filename = Column(
        String(255),
        nullable=True,
    )

    pdf_path = Column(
        String(500),
        nullable=True,
    )

    # Nullable FK — only set for conference papers
    conference_id = Column(
        Integer,
        ForeignKey("conferences.id"),
        nullable=True,
    )

    # Relationships
    conference = relationship("Conference", backref="publications")
    author_links = relationship(
        "PublicationAuthor",
        back_populates="publication",
    )
