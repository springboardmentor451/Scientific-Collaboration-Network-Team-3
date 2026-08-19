from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.form import Form
from pydantic import BaseModel


router = APIRouter(
    prefix="/forms",
    tags=["Forms"],
)


# ============================================================
# SCHEMAS
# ============================================================

class FormCreate(BaseModel):
    title: str
    description: str | None = None


class FormResponse(BaseModel):
    id: int
    title: str
    description: str | None = None

    class Config:
        from_attributes = True


# ============================================================
# CREATE FORM
# ============================================================

@router.post(
    "/",
    response_model=FormResponse,
)
def create_form(
    form_data: FormCreate,
    db: Session = Depends(get_db),
):
    new_form = Form(
        title=form_data.title,
        description=form_data.description,
    )

    db.add(new_form)
    db.commit()
    db.refresh(new_form)

    return new_form


# ============================================================
# GET ALL FORMS
# ============================================================

@router.get(
    "/",
    response_model=list[FormResponse],
)
def get_forms(
    db: Session = Depends(get_db),
):
    return db.query(Form).all()


# ============================================================
# GET SINGLE FORM
# ============================================================

@router.get(
    "/{form_id}",
    response_model=FormResponse,
)
def get_form(
    form_id: int,
    db: Session = Depends(get_db),
):
    form = (
        db.query(Form)
        .filter(Form.id == form_id)
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found",
        )

    return form