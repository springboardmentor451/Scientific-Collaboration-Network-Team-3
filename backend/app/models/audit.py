from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class AuditLog(Base):
    """Audit log — user activity, publication history, project logs, security logs."""

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    # Who performed the action
    user_id = Column(Integer, nullable=True)
    user_email = Column(String(255), nullable=True)

    # What was done
    action = Column(String(100), nullable=False)          # e.g. CREATE, UPDATE, DELETE, LOGIN
    resource = Column(String(100), nullable=True)          # e.g. Publication, Researcher
    resource_id = Column(Integer, nullable=True)

    # Extra detail (JSON-serialised payload diff, error msg, etc.)
    detail = Column(Text, nullable=True)

    # When
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
