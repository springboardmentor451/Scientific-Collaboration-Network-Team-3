from sqlalchemy.orm import Session
from app.models.citation import Citation
from app.schemas.citation import CitationCreate, CitationUpdate
from app.models.user import User
from fastapi import HTTPException, status


def get_all_citations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Citation).offset(skip).limit(limit).all()


def get_citation(db: Session, citation_id: int):
    return db.query(Citation).filter(Citation.id == citation_id).first()


def create_citation(db: Session, citation: CitationCreate, current_user: User):
    if current_user.role == "Reviewer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Reviewers cannot create citations."
        )
    
    new_citation = Citation(**citation.model_dump())
    db.add(new_citation)
    db.commit()
    db.refresh(new_citation)
    return new_citation


def update_citation(db: Session, citation_id: int, citation: CitationUpdate, current_user: User):
    if current_user.role == "Reviewer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Reviewers cannot update citations."
        )

    existing = get_citation(db, citation_id)
    if not existing:
        return None

    data = citation.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)
    return existing


def delete_citation(db: Session, citation_id: int, current_user: User):
    if current_user.role == "Reviewer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Reviewers cannot delete citations."
        )

    existing = get_citation(db, citation_id)
    if not existing:
        return None

    db.delete(existing)
    db.commit()
    return existing
