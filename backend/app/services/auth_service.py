"""
auth_service.py — Registration/login logic, token issuance, role checks.
Thin helper wrappers around the raw auth logic in security.py + the auth API router.
"""

from sqlalchemy.orm import Session

from app.models.user import User
from app.security import hash_password, verify_password, create_access_token


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Return the User if credentials are valid, else None."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None
    return user


def issue_token(user: User) -> dict:
    """Issue a JWT access token dict for the given user."""
    token = create_access_token(
        {"sub": user.email, "id": user.id, "role": user.role}
    )
    return {"access_token": token, "token_type": "bearer"}


def has_role(user: User, *roles: str) -> bool:
    """Return True if *user* has one of the provided roles."""
    return user.role in roles
