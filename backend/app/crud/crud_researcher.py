from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.researcher import Researcher
from app.schemas.researcher import ResearcherCreate, ResearcherUpdate


def create_researcher(db: Session, researcher_data: ResearcherCreate) -> Researcher:
    db_researcher = Researcher(**researcher_data.model_dump())
    db.add(db_researcher)
    db.commit()
    db.refresh(db_researcher)
    return db_researcher


def get_researcher(db: Session, researcher_id: int) -> Optional[Researcher]:
    return (
        db.query(Researcher)
        .filter(Researcher.id == researcher_id, Researcher.is_active == True)
        .first()
    )


def get_researchers(
    db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None
) -> List[Researcher]:
    query = db.query(Researcher).filter(Researcher.is_active == True)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Researcher.full_name.ilike(search_filter))
            | (Researcher.email.ilike(search_filter))
            | (Researcher.institution.ilike(search_filter))
            | (Researcher.department.ilike(search_filter))
        )
        
    return query.offset(skip).limit(limit).all()


def update_researcher(
    db: Session, researcher_id: int, researcher_data: ResearcherUpdate
) -> Optional[Researcher]:
    db_researcher = get_researcher(db, researcher_id)
    if not db_researcher:
        return None

    update_data = researcher_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_researcher, key, value)

    db.commit()
    db.refresh(db_researcher)
    return db_researcher


def soft_delete_researcher(db: Session, researcher_id: int) -> Optional[Researcher]:
    db_researcher = get_researcher(db, researcher_id)
    if not db_researcher:
        return None

    db_researcher.is_active = False
    db.commit()
    db.refresh(db_researcher)
    return db_researcher
