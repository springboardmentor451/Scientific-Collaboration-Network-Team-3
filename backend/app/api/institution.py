from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.institution import (
    InstitutionCreate,
    InstitutionUpdate,
    InstitutionResponse,
)

from app.services.institution_service import (
    get_all_institutions,
    get_institution,
    create_institution,
    update_institution,
    delete_institution,
)

router = APIRouter(
    prefix="/institutions",
    tags=["Institutions"],
)


@router.get(
    "/",
    response_model=list[InstitutionResponse]
)
def get_all(db: Session = Depends(get_db)):
    return get_all_institutions(db)


@router.get(
    "/{institution_id}",
    response_model=InstitutionResponse
)
def get_one(
    institution_id: int,
    db: Session = Depends(get_db)
):
    institution = get_institution(db, institution_id)

    if not institution:
        raise HTTPException(
            status_code=404,
            detail="Institution not found"
        )

    return institution


@router.post(
    "/",
    response_model=InstitutionResponse
)
def create(
    institution: InstitutionCreate,
    db: Session = Depends(get_db)
):
    return create_institution(db, institution)


@router.put(
    "/{institution_id}",
    response_model=InstitutionResponse
)
def update(
    institution_id: int,
    institution: InstitutionUpdate,
    db: Session = Depends(get_db)
):
    updated = update_institution(
        db,
        institution_id,
        institution
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Institution not found"
        )

    return updated


@router.delete(
    "/{institution_id}"
)
def delete(
    institution_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_institution(
        db,
        institution_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Institution not found"
        )

    return {
        "message": "Institution deleted successfully"
    }