from sqlalchemy.orm import Session

from app.models.collaboration import Collaboration
from app.schemas.collaboration import (
    CollaborationCreate,
    CollaborationUpdate,
)


def get_all(db: Session):
    return db.query(Collaboration).all()


def get_by_id(db: Session, collaboration_id: int):
    return (
        db.query(Collaboration)
        .filter(Collaboration.id == collaboration_id)
        .first()
    )


def create(db: Session, collaboration: CollaborationCreate):
    new_collaboration = Collaboration(
        **collaboration.model_dump()
    )

    db.add(new_collaboration)
    db.commit()
    db.refresh(new_collaboration)

    return new_collaboration


def update(
    db: Session,
    collaboration_id: int,
    collaboration: CollaborationUpdate,
):
    db_collaboration = get_by_id(
        db,
        collaboration_id,
    )

    if not db_collaboration:
        return None

    data = collaboration.model_dump(exclude_unset=True)

    for key, value in data.items():
        setattr(db_collaboration, key, value)

    db.commit()
    db.refresh(db_collaboration)

    return db_collaboration


def delete(db: Session, collaboration_id: int):
    db_collaboration = get_by_id(
        db,
        collaboration_id,
    )

    if not db_collaboration:
        return None

    db.delete(db_collaboration)
    db.commit()

    return db_collaboration