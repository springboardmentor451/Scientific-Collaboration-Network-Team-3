"""Collaboration CRUD helpers."""

from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.collaboration import Collaboration
from app.schemas.collaboration import CollaborationCreate, CollaborationUpdate


def get_all_collaborations(db: Session, skip: int = 0, limit: int = 100) -> List[Collaboration]:
    return db.query(Collaboration).offset(skip).limit(limit).all()


def get_collaboration(db: Session, collaboration_id: int) -> Optional[Collaboration]:
    return db.query(Collaboration).filter(Collaboration.id == collaboration_id).first()


def create_collaboration(db: Session, collab: CollaborationCreate) -> Collaboration:
    obj = Collaboration(**collab.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_collaboration(
    db: Session, collaboration_id: int, collab: CollaborationUpdate
) -> Optional[Collaboration]:
    obj = get_collaboration(db, collaboration_id)
    if not obj:
        return None
    for key, value in collab.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_collaboration(db: Session, collaboration_id: int) -> Optional[Collaboration]:
    obj = get_collaboration(db, collaboration_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
