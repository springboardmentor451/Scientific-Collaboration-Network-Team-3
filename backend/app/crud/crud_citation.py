"""Citation CRUD helpers."""

from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.citation import Citation
from app.schemas.citation import CitationCreate, CitationUpdate


def get_all_citations(db: Session, skip: int = 0, limit: int = 100) -> List[Citation]:
    return db.query(Citation).offset(skip).limit(limit).all()


def get_citation(db: Session, citation_id: int) -> Optional[Citation]:
    return db.query(Citation).filter(Citation.id == citation_id).first()


def create_citation(db: Session, citation: CitationCreate) -> Citation:
    obj = Citation(**citation.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_citation(
    db: Session, citation_id: int, citation: CitationUpdate
) -> Optional[Citation]:
    obj = get_citation(db, citation_id)
    if not obj:
        return None
    for key, value in citation.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_citation(db: Session, citation_id: int) -> Optional[Citation]:
    obj = get_citation(db, citation_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
