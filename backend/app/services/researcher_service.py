from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import crud_researcher
from app.models.researcher import Researcher
from app.models.user import User
from app.schemas.researcher import ResearcherCreate, ResearcherUpdate


def create_researcher(
    db: Session, researcher_data: ResearcherCreate, current_user: User
):
    # If a non-System Admin creates a profile without specifying a user_id, assume it's for themselves.
    if current_user.role != "System Admin" and researcher_data.user_id is None:
        # Force the user_id to be the current user
        researcher_data.user_id = current_user.id
        
    return crud_researcher.create_researcher(db, researcher_data)


def get_all_researchers(
    db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None
):
    # Anyone authenticated can view researchers
    return crud_researcher.get_researchers(db, skip, limit, search)


def get_researcher_by_id(db: Session, researcher_id: int):
    # Anyone authenticated can view a researcher
    return crud_researcher.get_researcher(db, researcher_id)


def update_researcher(
    db: Session, researcher_id: int, researcher_data: ResearcherUpdate, current_user: User
):
    # Fetch existing to check permissions
    db_researcher = crud_researcher.get_researcher(db, researcher_id)
    if not db_researcher:
        return None

    _check_write_permissions(db, db_researcher, current_user)

    return crud_researcher.update_researcher(db, researcher_id, researcher_data)


def delete_researcher(db: Session, researcher_id: int, current_user: User):
    db_researcher = crud_researcher.get_researcher(db, researcher_id)
    if not db_researcher:
        return None

    _check_write_permissions(db, db_researcher, current_user)

    return crud_researcher.soft_delete_researcher(db, researcher_id)


def _check_write_permissions(db: Session, researcher, current_user: User):
    """
    RBAC Rules:
    - System Admin has full access.
    - Institution Admin manages researchers in their institution. 
    - Researcher edits own.
    - Reviewer denied.
    """
    if current_user.role == "System Admin":
        return True
        
    if current_user.role == "Institution Admin":
        # Find the Inst Admin's own researcher profile to get their institution
        admin_profile = db.query(Researcher).filter(Researcher.user_id == current_user.id, Researcher.is_active == True).first()
        if admin_profile and admin_profile.institution == researcher.institution:
            return True
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage researchers within your own institution."
        )

    # For Researcher role, they can only edit their own profile
    if current_user.role == "Researcher" and researcher.user_id == current_user.id:
        return True

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to modify this researcher profile."
    )
