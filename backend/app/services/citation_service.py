# Citation linking + DOI resolution logic
from sqlalchemy.orm import Session

from app.models.citation import Citation
from app.schemas.citation import CitationCreate, CitationUpdate


def get_all(db: Session):
    return db.query(Citation).all()


def get_by_id(db: Session, citation_id: int):
    return db.query(Citation).filter(Citation.id == citation_id).first()


def create(db: Session, citation: CitationCreate):
    new_citation = Citation(**citation.model_dump())

    db.add(new_citation)
    db.commit()
    db.refresh(new_citation)

    return new_citation


def update(db: Session, citation_id: int, citation: CitationUpdate):
    db_citation = get_by_id(db, citation_id)

    if not db_citation:
        return None

    update_data = citation.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_citation, key, value)

    db.commit()
    db.refresh(db_citation)

    return db_citation


def delete(db: Session, citation_id: int):
    db_citation = get_by_id(db, citation_id)

    if not db_citation:
        return None

    db.delete(db_citation)
    db.commit()

    return db_citation