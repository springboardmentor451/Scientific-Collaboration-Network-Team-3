from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.collaboration import (
    CollaborationCreate,
    CollaborationResponse,
    CollaborationUpdate,
    NetworkResponse
)
from app.security import get_current_user
from app.services.collaboration_service import (
    create_collaboration,
    delete_collaboration,
    get_all_collaborations,
    get_collaboration,
    get_network,
    update_collaboration,
)

router = APIRouter(
    prefix="/collaborations",
    tags=["Collaborations"]
)


@router.get("/network", response_model=NetworkResponse)
def network(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_network(db)


@router.post("/", response_model=CollaborationResponse)
def create(
    collab: CollaborationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["System Admin", "Institution Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can manage collaborations directly."
        )
    return create_collaboration(db, collab)


@router.get("/", response_model=List[CollaborationResponse])
def get_all(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_collaborations(db, skip, limit)


@router.get("/{collab_id}", response_model=CollaborationResponse)
def get_one(
    collab_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = get_collaboration(db, collab_id)
    if not c:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    return c


@router.put("/{collab_id}", response_model=CollaborationResponse)
def update(
    collab_id: int,
    collab: CollaborationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["System Admin", "Institution Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can manage collaborations directly."
        )

    updated = update_collaboration(db, collab_id, collab)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    return updated


@router.delete("/{collab_id}")
def delete(
    collab_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["System Admin", "Institution Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can manage collaborations directly."
        )

    success = delete_collaboration(db, collab_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    return {"message": "Collaboration deleted successfully"}