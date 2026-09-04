from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class PublicationAuthor(Base):
    __tablename__ = "publication_authors"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    publication_id = Column(
        Integer,
        ForeignKey("publications.id"),
        nullable=False,
    )

    researcher_id = Column(
        Integer,
        ForeignKey("researchers.id"),
        nullable=False,
    )

    author_role = Column(
        String(50),
        nullable=False,
        default="co_author",
    )

    # Relationships
    publication = relationship(
        "Publication",
        back_populates="author_links",
    )

    researcher = relationship(
        "Researcher",
        back_populates="publication_links",
    )
