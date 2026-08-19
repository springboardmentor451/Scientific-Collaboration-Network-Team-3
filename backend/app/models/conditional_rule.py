from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class ConditionalRule(Base):
    __tablename__ = "conditional_rules"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    form_id = Column(
        Integer,
        nullable=False,
        index=True,
    )

    trigger_field = Column(
        String(255),
        nullable=False,
    )

    operator = Column(
        String(50),
        nullable=False,
    )

    comparison_value = Column(
        Text,
        nullable=True,
    )

    target_field = Column(
        String(255),
        nullable=False,
    )

    action = Column(
        String(20),
        nullable=False,
    )