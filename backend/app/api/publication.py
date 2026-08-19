from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.publication import (
    PublicationCreate,
    PublicationUpdate,
    PublicationResponse,
)

from app.services.publication_service import (
    create_publication,
    get_all_publications,
    get_publication_by_id,
    update_publication,
    delete_publication,
)

router = APIRouter(
    prefix="/publications",
    tags=["Publications"],
)


@router.post("/", response_model=PublicationResponse)
def create(
    publication: PublicationCreate,
    db: Session = Depends(get_db),
):
    return create_publication(db, publication)


@router.get("/", response_model=list[PublicationResponse])
def get_all(
    db: Session = Depends(get_db),
):
    return get_all_publications(db)


@router.get("/{publication_id}", response_model=PublicationResponse)
def get_one(
    publication_id: int,
    db: Session = Depends(get_db),
):
    publication = get_publication_by_id(
        db,
        publication_id,
    )

    if not publication:
        raise HTTPException(
            status_code=404,
            detail="Publication not found",
        )

    return publication


@router.put("/{publication_id}", response_model=PublicationResponse)
def update(
    publication_id: int,
    publication: PublicationUpdate,
    db: Session = Depends(get_db),
):
    updated = update_publication(
        db,
        publication_id,
        publication,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Publication not found",
        )

    return updated


@router.delete("/{publication_id}")
def delete(
    publication_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_publication(
        db,
        publication_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Publication not found",
        )

    return {
        "message": "Publication deleted successfully"
    }