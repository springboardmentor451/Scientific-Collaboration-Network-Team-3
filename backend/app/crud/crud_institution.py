"""Institution CRUD helpers."""

from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.institution import Institution
from app.schemas.institution import InstitutionCreate, InstitutionUpdate


def get_all_institutions(db: Session) -> List[Institution]:
    return db.query(Institution).all()


def get_institution(db: Session, institution_id: int) -> Optional[Institution]:
    return db.query(Institution).filter(Institution.id == institution_id).first()


def create_institution(db: Session, institution: InstitutionCreate) -> Institution:
    obj = Institution(**institution.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_institution(
    db: Session, institution_id: int, institution: InstitutionUpdate
) -> Optional[Institution]:
    obj = get_institution(db, institution_id)
    if not obj:
        return None
    for key, value in institution.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_institution(db: Session, institution_id: int) -> Optional[Institution]:
    obj = get_institution(db, institution_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
