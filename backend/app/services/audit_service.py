from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.audit import AuditLog


def log_action(
    db: Session,
    action: str,
    resource: str,
    resource_id: Optional[int] = None,
    user_id: Optional[int] = None,
    user_email: Optional[str] = None,
    detail: Optional[str] = None,
) -> AuditLog:
    """Write a single audit-log entry."""
    entry = AuditLog(
        action=action,
        resource=resource,
        resource_id=resource_id,
        user_id=user_id,
        user_email=user_email,
        detail=detail,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_audit_logs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    resource: Optional[str] = None,
    user_id: Optional[int] = None,
) -> List[AuditLog]:
    """Query audit logs, optionally filtered by resource type or user."""
    q = db.query(AuditLog)
    if resource:
        q = q.filter(AuditLog.resource == resource)
    if user_id is not None:
        q = q.filter(AuditLog.user_id == user_id)
    return q.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
