"""
users.py — Admin-only API for managing platform users (list, activate/deactivate, change role).
"""
import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.security import require_role

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["User Management"],
)


# ---------------------------------------------------------------------------
# Schemas (inline — simple enough to not warrant a separate file)
# ---------------------------------------------------------------------------

class UserListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    role: str
    is_active: bool


class UserUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None


ALLOWED_ROLES = {"Researcher", "Institution Admin", "Reviewer", "System Admin"}


# ---------------------------------------------------------------------------
# GET /users — list all users (System Admin only)
# ---------------------------------------------------------------------------

@router.get("/", response_model=List[UserListItem])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("System Admin")),
):
    return db.query(User).offset(skip).limit(limit).all()


# ---------------------------------------------------------------------------
# GET /users/:id — get single user
# ---------------------------------------------------------------------------

@router.get("/{user_id}", response_model=UserListItem)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("System Admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ---------------------------------------------------------------------------
# PATCH /users/:id — update role or active status
# ---------------------------------------------------------------------------

@router.patch("/{user_id}", response_model=UserListItem)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("System Admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.role is not None:
        if payload.role not in ALLOWED_ROLES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid role. Allowed: {', '.join(sorted(ALLOWED_ROLES))}",
            )
        # Prevent demoting the last System Admin
        if user.role == "System Admin" and payload.role != "System Admin":
            admin_count = db.query(User).filter(
                User.role == "System Admin", User.is_active == True
            ).count()
            if admin_count <= 1:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot demote the last active System Admin.",
                )
        user.role = payload.role

    if payload.is_active is not None:
        user.is_active = payload.is_active

    db.commit()
    db.refresh(user)
    logger.info(
        "User %s (id=%d) updated by admin %s (id=%d): role=%s active=%s",
        user.email, user.id,
        current_user.email, current_user.id,
        payload.role, payload.is_active,
    )
    return user
