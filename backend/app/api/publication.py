from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.publication import PublicationCreate, PublicationResponse, PublicationUpdate
from app.security import get_current_user
from app.services.publication_service import (
    create_publication,
    delete_publication,
    get_all_publications,
    get_publication_by_id,
    update_publication,
)

router = APIRouter(
    prefix="/publications",
    tags=["Publications"]
)


@router.post("/", response_model=PublicationResponse)
def create(
    publication: PublicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_publication(db, publication, current_user)


@router.get("/", response_model=List[PublicationResponse])
def get_all(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_publications(db, skip, limit, search)


@router.get("/{publication_id}", response_model=PublicationResponse)
def get_one(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pub = get_publication_by_id(db, publication_id)
    if not pub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Publication not found"
        )
    return pub


@router.put("/{publication_id}", response_model=PublicationResponse)
def update(
    publication_id: int,
    publication: PublicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = update_publication(db, publication_id, publication, current_user)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Publication not found"
        )
    return updated


@router.delete("/{publication_id}")
def delete(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = delete_publication(db, publication_id, current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Publication not found"
        )
    return {"message": "Publication deleted successfully"}