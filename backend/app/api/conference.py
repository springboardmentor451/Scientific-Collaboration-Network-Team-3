from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.conference import ConferenceCreate, ConferenceResponse, ConferenceUpdate
from app.security import get_current_user
from app.services.conference_service import (
    create_conference,
    delete_conference,
    get_all_conferences,
    get_conference,
    update_conference,
)

router = APIRouter(
    prefix="/conferences",
    tags=["Conferences"]
)


@router.post("/", response_model=ConferenceResponse)
def create(
    conference: ConferenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_conference(db, conference, current_user)


@router.get("/", response_model=List[ConferenceResponse])
def get_all(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_conferences(db, skip, limit)


@router.get("/{conference_id}", response_model=ConferenceResponse)
def get_one(
    conference_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conf = get_conference(db, conference_id)
    if not conf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found"
        )
    return conf


@router.put("/{conference_id}", response_model=ConferenceResponse)
def update(
    conference_id: int,
    conference: ConferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = update_conference(db, conference_id, conference, current_user)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found"
        )
    return updated


@router.delete("/{conference_id}")
def delete(
    conference_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = delete_conference(db, conference_id, current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found"
        )
    return {"message": "Conference deleted successfully"}