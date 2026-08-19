from sqlalchemy import Column, Integer, JSON, ForeignKey

from app.database import Base


class Response(Base):
    __tablename__ = "responses"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    form_id = Column(
        Integer,
        ForeignKey("forms.id"),
        nullable=False,
    )

    answers = Column(
        JSON,
        nullable=False,
    )