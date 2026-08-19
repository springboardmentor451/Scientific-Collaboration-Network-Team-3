from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class Form(Base):
    __tablename__ = "forms"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )