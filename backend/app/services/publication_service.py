from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import crud_publication
from app.models.publication import Publication
from app.models.publication_author import PublicationAuthor
from app.models.researcher import Researcher
from app.models.user import User
from app.schemas.publication import PublicationCreate, PublicationUpdate


def create_publication(db: Session, pub_data: PublicationCreate, current_user: User):
    if current_user.role == "Reviewer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Reviewers cannot create publications."
        )

    # For researchers, ensure they link themselves as an author automatically
    # Or just let them create it, but in reality we should verify they add themselves.
    return crud_publication.create_publication(db, pub_data)


def get_all_publications(
    db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None
):
    return crud_publication.get_publications(db, skip, limit, search)


def get_publication_by_id(db: Session, pub_id: int):
    return crud_publication.get_publication(db, pub_id)


def update_publication(
    db: Session, pub_id: int, pub_data: PublicationUpdate, current_user: User
):
    db_pub = crud_publication.get_publication(db, pub_id)
    if not db_pub:
        return None

    _check_write_permissions(db, db_pub, current_user)
    return crud_publication.update_publication(db, pub_id, pub_data)


def delete_publication(db: Session, pub_id: int, current_user: User):
    db_pub = crud_publication.get_publication(db, pub_id)
    if not db_pub:
        return False

    _check_write_permissions(db, db_pub, current_user)
    return crud_publication.delete_publication(db, pub_id)


def _check_write_permissions(db: Session, publication: Publication, current_user: User):
    if current_user.role == "System Admin":
        return True
        
    if current_user.role == "Reviewer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Reviewers cannot modify publications."
        )

    if current_user.role == "Institution Admin":
        admin_profile = db.query(Researcher).filter(Researcher.user_id == current_user.id, Researcher.is_active == True).first()
        if not admin_profile:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Institution Admin profile not found."
            )
            
        # Check if ANY of the authors on this publication belongs to this admin's institution
        author_ids = [link.researcher_id for link in publication.author_links]
        if not author_ids:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot modify a publication with no authors from your institution."
            )
            
        authors = db.query(Researcher).filter(Researcher.id.in_(author_ids)).all()
        if any(author.institution == admin_profile.institution for author in authors):
            return True
            
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage publications linked to researchers in your institution."
        )

    if current_user.role == "Researcher":
        # Check if the current user is one of the authors
        current_researcher = db.query(Researcher).filter(Researcher.user_id == current_user.id, Researcher.is_active == True).first()
        if not current_researcher:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Researcher profile not found."
            )
            
        is_author = any(link.researcher_id == current_researcher.id for link in publication.author_links)
        if is_author:
            return True
            
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only modify your own publications."
        )

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Permission denied."
    )
