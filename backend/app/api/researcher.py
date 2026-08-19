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

from app.security import get_current_user


router = APIRouter(
    prefix="/researchers",
    tags=["Researchers"],
)


# -------------------------------------------------
# Create Researcher
# -------------------------------------------------

@router.post(
    "/",
    response_model=ResearcherResponse
)
def create(
    researcher: ResearcherCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_researcher(
        db,
        researcher
    )


# -------------------------------------------------
# Get All Researchers
# -------------------------------------------------

@router.get(
    "/",
    response_model=list[ResearcherResponse]
)
def get_all(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_all_researchers(db)


# -------------------------------------------------
# Get One Researcher
# -------------------------------------------------

@router.get(
    "/{researcher_id}",
    response_model=ResearcherResponse
)
def get_one(
    researcher_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    researcher = get_researcher_by_id(
        db,
        researcher_id
    )

    if not researcher:
        raise HTTPException(
            status_code=404,
            detail="Researcher not found",
        )

    return researcher


# -------------------------------------------------
# Update Researcher
# -------------------------------------------------

@router.put(
    "/{researcher_id}",
    response_model=ResearcherResponse
)
def update(
    researcher_id: int,
    researcher: ResearcherUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
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


# -------------------------------------------------
# Delete Researcher
# -------------------------------------------------

@router.delete(
    "/{researcher_id}"
)
def delete(
    researcher_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
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