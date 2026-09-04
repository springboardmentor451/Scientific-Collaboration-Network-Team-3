from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.institution import InstitutionCreate, InstitutionResponse, InstitutionUpdate
from app.security import get_current_user
from app.services.institution_service import (
    create_institution,
    delete_institution,
    get_all_institutions,
    get_institution,
    update_institution,
)

router = APIRouter(
    prefix="/institutions",
    tags=["Institutions"]
)


@router.post("/", response_model=InstitutionResponse)
def create(
    institution: InstitutionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_institution(db, institution, current_user)


@router.get("/", response_model=List[InstitutionResponse])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_institutions(db)


@router.get("/{institution_id}", response_model=InstitutionResponse)
def get_one(
    institution_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    inst = get_institution(db, institution_id)
    if not inst:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    return inst


@router.put("/{institution_id}", response_model=InstitutionResponse)
def update(
    institution_id: int,
    institution: InstitutionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = update_institution(db, institution_id, institution, current_user)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    return updated


@router.delete("/{institution_id}")
def delete(
    institution_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = delete_institution(db, institution_id, current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    return {"message": "Institution deleted successfully"}