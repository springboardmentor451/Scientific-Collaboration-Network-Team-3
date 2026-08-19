from sqlalchemy.orm import Session

from app.models.response import Response
from app.schemas.response import ResponseCreate


# ============================================================
# CREATE / SUBMIT RESPONSE
# ============================================================

def create_response(
    db: Session,
    response_data: ResponseCreate,
):
    new_response = Response(
        form_id=response_data.form_id,
        answers=response_data.answers,
    )

    db.add(new_response)
    db.commit()
    db.refresh(new_response)

    return new_response


# ============================================================
# GET ALL RESPONSES FOR A FORM
# ============================================================

def get_responses_by_form(
    db: Session,
    form_id: int,
):
    return (
        db.query(Response)
        .filter(
            Response.form_id == form_id
        )
        .all()
    )


# ============================================================
# GET SINGLE RESPONSE
# ============================================================

def get_response_by_id(
    db: Session,
    response_id: int,
):
    return (
        db.query(Response)
        .filter(
            Response.id == response_id
        )
        .first()
    )