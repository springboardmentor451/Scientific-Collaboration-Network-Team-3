from sqlalchemy.orm import Session
from app.models.conference import Conference
from app.schemas.conference import ConferenceCreate, ConferenceUpdate
from app.models.user import User
from fastapi import HTTPException, status


def get_all_conferences(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Conference).offset(skip).limit(limit).all()


def get_conference(db: Session, conference_id: int):
    return db.query(Conference).filter(Conference.id == conference_id).first()


def create_conference(db: Session, conference: ConferenceCreate, current_user: User):
    if current_user.role not in ["System Admin", "Institution Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can create conferences."
        )
    
    new_conf = Conference(**conference.model_dump())
    db.add(new_conf)
    db.commit()
    db.refresh(new_conf)
    return new_conf


def update_conference(db: Session, conference_id: int, conference: ConferenceUpdate, current_user: User):
    if current_user.role not in ["System Admin", "Institution Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can update conferences."
        )

    existing = get_conference(db, conference_id)
    if not existing:
        return None

    data = conference.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)
    return existing


def delete_conference(db: Session, conference_id: int, current_user: User):
    if current_user.role != "System Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only System Admins can delete conferences."
        )

    existing = get_conference(db, conference_id)
    if not existing:
        return None

    db.delete(existing)
    db.commit()
    return existing
