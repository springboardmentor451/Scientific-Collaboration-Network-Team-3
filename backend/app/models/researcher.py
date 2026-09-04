from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Researcher(Base):
    __tablename__ = "researchers"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Nullable FK — safe for existing rows that predate this column
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        unique=True,
    )

    full_name = Column(
        String(200),
        nullable=False,
    )

    email = Column(
        String(255),
        nullable=False,
        unique=True,
    )

    department = Column(
        String(200),
        nullable=False,
    )

    institution = Column(
        String(255),
        nullable=False,
    )

    designation = Column(
        String(150),
        nullable=False,
    )

    research_interests = Column(
        Text,
        nullable=True,
    )

    skills = Column(
        Text,
        nullable=True,
    )

    affiliation = Column(
        String(255),
        nullable=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="1",
    )

    # Relationships
    user = relationship("User", backref="researcher_profile")
    publication_links = relationship(
        "PublicationAuthor",
        back_populates="researcher",
    )
