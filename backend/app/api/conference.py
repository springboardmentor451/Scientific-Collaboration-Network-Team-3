from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.conference import (
    ConferenceCreate,
    ConferenceUpdate,
    ConferenceResponse,
)

from app.services.conference_service import (
    get_all_conferences,
    get_conference,
    create_conference,
    update_conference,
    delete_conference,
)

router = APIRouter(
    prefix="/conferences",
    tags=["Conferences"],
)


@router.get(
    "/",
    response_model=list[ConferenceResponse]
)
def get_all(db: Session = Depends(get_db)):
    return get_all_conferences(db)


@router.get(
    "/{conference_id}",
    response_model=ConferenceResponse
)
def get_one(
    conference_id: int,
    db: Session = Depends(get_db)
):
    conference = get_conference(db, conference_id)

    if not conference:
        raise HTTPException(
            status_code=404,
            detail="Conference not found"
        )

    return conference


@router.post(
    "/",
    response_model=ConferenceResponse
)
def create(
    conference: ConferenceCreate,
    db: Session = Depends(get_db)
):
    return create_conference(db, conference)


@router.put(
    "/{conference_id}",
    response_model=ConferenceResponse
)
def update(
    conference_id: int,
    conference: ConferenceUpdate,
    db: Session = Depends(get_db)
):
    updated = update_conference(
        db,
        conference_id,
        conference
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Conference not found"
        )

    return updated


@router.delete(
    "/{conference_id}"
)
def delete(
    conference_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_conference(
        db,
        conference_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Conference not found"
        )

    return {
        "message": "Conference deleted successfully"
    }