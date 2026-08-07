from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.collaboration import (
    CollaborationCreate,
    CollaborationUpdate,
    CollaborationResponse,
)

from app.services import collaboration_service

router = APIRouter(
    prefix="/collaborations",
    tags=["Collaborations"],
)


@router.get("/", response_model=list[CollaborationResponse])
def get_all(db: Session = Depends(get_db)):
    return collaboration_service.get_all(db)


@router.get("/{collaboration_id}", response_model=CollaborationResponse)
def get_one(
    collaboration_id: int,
    db: Session = Depends(get_db),
):
    collaboration = collaboration_service.get_by_id(
        db,
        collaboration_id,
    )

    if not collaboration:
        raise HTTPException(
            status_code=404,
            detail="Collaboration not found",
        )

    return collaboration


@router.post("/", response_model=CollaborationResponse)
def create(
    collaboration: CollaborationCreate,
    db: Session = Depends(get_db),
):
    try:
        return collaboration_service.create(
            db,
            collaboration,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.put("/{collaboration_id}", response_model=CollaborationResponse)
def update(
    collaboration_id: int,
    collaboration: CollaborationUpdate,
    db: Session = Depends(get_db),
):
    try:
        updated = collaboration_service.update(
            db,
            collaboration_id,
            collaboration,
        )

        if not updated:
            raise HTTPException(
                status_code=404,
                detail="Collaboration not found",
            )

        return updated

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.delete("/{collaboration_id}")
def delete(
    collaboration_id: int,
    db: Session = Depends(get_db),
):
    try:
        deleted = collaboration_service.delete(
            db,
            collaboration_id,
        )

        if not deleted:
            raise HTTPException(
                status_code=404,
                detail="Collaboration not found",
            )

        return {
            "message": "Collaboration deleted successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )