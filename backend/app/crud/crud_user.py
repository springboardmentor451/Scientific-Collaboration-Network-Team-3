"""User CRUD helpers."""

from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.security import hash_password


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, username: str, email: str, password: str, role: str = "Researcher") -> User:
    obj = User(
        username=username,
        email=email,
        hashed_password=hash_password(password),
        role=role,
        is_active=True,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def set_active(db: Session, user_id: int, is_active: bool) -> Optional[User]:
    obj = get_user_by_id(db, user_id)
    if not obj:
        return None
    obj.is_active = is_active
    db.commit()
    db.refresh(obj)
    return obj
