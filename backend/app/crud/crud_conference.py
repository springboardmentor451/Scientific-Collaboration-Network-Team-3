"""Conference CRUD helpers."""

from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.conference import Conference
from app.schemas.conference import ConferenceCreate, ConferenceUpdate


def get_all_conferences(db: Session, skip: int = 0, limit: int = 100) -> List[Conference]:
    return db.query(Conference).offset(skip).limit(limit).all()


def get_conference(db: Session, conference_id: int) -> Optional[Conference]:
    return db.query(Conference).filter(Conference.id == conference_id).first()


def create_conference(db: Session, conference: ConferenceCreate) -> Conference:
    obj = Conference(**conference.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_conference(
    db: Session, conference_id: int, conference: ConferenceUpdate
) -> Optional[Conference]:
    obj = get_conference(db, conference_id)
    if not obj:
        return None
    for key, value in conference.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_conference(db: Session, conference_id: int) -> Optional[Conference]:
    obj = get_conference(db, conference_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
