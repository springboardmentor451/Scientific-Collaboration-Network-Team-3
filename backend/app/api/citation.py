from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.citation import (
    CitationCreate,
    CitationUpdate,
    CitationResponse,
)

from app.services import citation_service

router = APIRouter(
    prefix="/citations",
    tags=["Citations"],
)


@router.get("/", response_model=list[CitationResponse])
def get_all(db: Session = Depends(get_db)):
    return citation_service.get_all(db)


@router.get("/{citation_id}", response_model=CitationResponse)
def get_one(citation_id: int, db: Session = Depends(get_db)):
    citation = citation_service.get_by_id(db, citation_id)

    if not citation:
        raise HTTPException(status_code=404, detail="Citation not found")

    return citation


@router.post("/", response_model=CitationResponse)
def create(citation: CitationCreate, db: Session = Depends(get_db)):
    return citation_service.create(db, citation)


@router.put("/{citation_id}", response_model=CitationResponse)
def update(
    citation_id: int,
    citation: CitationUpdate,
    db: Session = Depends(get_db),
):
    updated = citation_service.update(db, citation_id, citation)

    if not updated:
        raise HTTPException(status_code=404, detail="Citation not found")

    return updated


@router.delete("/{citation_id}")
def delete(citation_id: int, db: Session = Depends(get_db)):
    deleted = citation_service.delete(db, citation_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Citation not found")

    return {"message": "Citation deleted successfully"}