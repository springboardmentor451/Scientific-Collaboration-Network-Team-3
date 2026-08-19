# Conference registration & scheduling logic
from sqlalchemy.orm import Session

from app.models.conference import Conference
from app.schemas.conference import (
    ConferenceCreate,
    ConferenceUpdate,
)


def get_all_conferences(db: Session):
    return db.query(Conference).all()


def get_conference(db: Session, conference_id: int):
    return (
        db.query(Conference)
        .filter(Conference.id == conference_id)
        .first()
    )


def create_conference(
    db: Session,
    conference: ConferenceCreate
):
    new_conference = Conference(**conference.model_dump())

    db.add(new_conference)
    db.commit()
    db.refresh(new_conference)

    return new_conference


def update_conference(
    db: Session,
    conference_id: int,
    conference: ConferenceUpdate
):
    existing = get_conference(db, conference_id)

    if not existing:
        return None

    data = conference.model_dump(exclude_unset=True)

    for key, value in data.items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


def delete_conference(
    db: Session,
    conference_id: int
):
    conference = get_conference(db, conference_id)

    if not conference:
        return None

    db.delete(conference)
    db.commit()

    return conference