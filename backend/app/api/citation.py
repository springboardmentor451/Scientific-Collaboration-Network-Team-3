from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.citation import CitationCreate, CitationResponse, CitationUpdate
from app.security import get_current_user
from app.services.citation_service import (
    create_citation,
    delete_citation,
    get_all_citations,
    get_citation,
    update_citation,
)

router = APIRouter(
    prefix="/citations",
    tags=["Citations"]
)


@router.post("/", response_model=CitationResponse)
def create(
    citation: CitationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_citation(db, citation, current_user)


@router.get("/", response_model=List[CitationResponse])
def get_all(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_citations(db, skip, limit)


@router.get("/{citation_id}", response_model=CitationResponse)
def get_one(
    citation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    citation = get_citation(db, citation_id)
    if not citation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citation not found"
        )
    return citation


@router.put("/{citation_id}", response_model=CitationResponse)
def update(
    citation_id: int,
    citation: CitationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = update_citation(db, citation_id, citation, current_user)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citation not found"
        )
    return updated


@router.delete("/{citation_id}")
def delete(
    citation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = delete_citation(db, citation_id, current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citation not found"
        )
    return {"message": "Citation deleted successfully"}