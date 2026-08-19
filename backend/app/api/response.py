from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.response import (
    ResponseCreate,
    ResponseResponse,
)

from app.services.response_service import (
    create_response,
    get_responses_by_form,
    get_response_by_id,
)


router = APIRouter(
    prefix="/responses",
    tags=["Responses"],
)


# ============================================================
# SUBMIT RESPONSE
# ============================================================

@router.post(
    "/",
    response_model=ResponseResponse,
)
def submit_response(
    response_data: ResponseCreate,
    db: Session = Depends(get_db),
):
    return create_response(
        db=db,
        response_data=response_data,
    )


# ============================================================
# GET ALL RESPONSES FOR A FORM
# ============================================================

@router.get(
    "/form/{form_id}",
    response_model=list[ResponseResponse],
)
def get_form_responses(
    form_id: int,
    db: Session = Depends(get_db),
):
    return get_responses_by_form(
        db=db,
        form_id=form_id,
    )


# ============================================================
# GET SINGLE RESPONSE
# ============================================================

@router.get(
    "/{response_id}",
    response_model=ResponseResponse,
)
def get_single_response(
    response_id: int,
    db: Session = Depends(get_db),
):
    response = get_response_by_id(
        db=db,
        response_id=response_id,
    )

    if not response:
        raise HTTPException(
            status_code=404,
            detail="Response not found",
        )

    return response