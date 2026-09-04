from sqlalchemy.orm import Session

from app.models.institution import Institution
from app.schemas.institution import (
    InstitutionCreate,
    InstitutionUpdate,
)


def get_all_institutions(db: Session):
    return db.query(Institution).all()


def get_institution(db: Session, institution_id: int):
    return (
        db.query(Institution)
        .filter(Institution.id == institution_id)
        .first()
    )


from fastapi import HTTPException, status
from app.models.user import User

def create_institution(db: Session, institution: InstitutionCreate, current_user: User):
    if current_user.role != "System Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only System Admins can create institutions."
        )

    new_institution = Institution(**institution.model_dump())

    db.add(new_institution)
    db.commit()
    db.refresh(new_institution)

    return new_institution


def update_institution(
    db: Session,
    institution_id: int,
    institution: InstitutionUpdate,
    current_user: User,
):
    if current_user.role != "System Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only System Admins can update institutions."
        )

    existing = get_institution(db, institution_id)

    if not existing:
        return None

    data = institution.model_dump(exclude_unset=True)

    for key, value in data.items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


def delete_institution(db: Session, institution_id: int, current_user: User):
    if current_user.role != "System Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only System Admins can delete institutions."
        )

    institution = get_institution(db, institution_id)

    if not institution:
        return None

    db.delete(institution)
    db.commit()

    return institution