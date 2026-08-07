from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.researcher import (
    ResearcherCreate,
    ResearcherUpdate,
    ResearcherResponse,
)

from app.services.researcher_service import (
    create_researcher,
    get_all_researchers,
    get_researcher_by_id,
    update_researcher,
    delete_researcher,
)

router = APIRouter(
    prefix="/researchers",
    tags=["Researchers"],
)


@router.post("/", response_model=ResearcherResponse)
def create(
    researcher: ResearcherCreate,
    db: Session = Depends(get_db),
):
    return create_researcher(db, researcher)


@router.get("/", response_model=list[ResearcherResponse])
def get_all(
    db: Session = Depends(get_db),
):
    return get_all_researchers(db)


@router.get("/{researcher_id}", response_model=ResearcherResponse)
def get_one(
    researcher_id: int,
    db: Session = Depends(get_db),
):
    researcher = get_researcher_by_id(db, researcher_id)

    if not researcher:
        raise HTTPException(
            status_code=404,
            detail="Researcher not found",
        )

    return researcher


@router.put("/{researcher_id}", response_model=ResearcherResponse)
def update(
    researcher_id: int,
    researcher: ResearcherUpdate,
    db: Session = Depends(get_db),
):
    updated = update_researcher(
        db,
        researcher_id,
        researcher,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Researcher not found",
        )

    return updated


@router.delete("/{researcher_id}")
def delete(
    researcher_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_researcher(
        db,
        researcher_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Researcher not found",
        )

    return {
        "message": "Researcher deleted successfully"
    }