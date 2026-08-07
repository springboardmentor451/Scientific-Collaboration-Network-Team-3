# Researcher profile business logic
from sqlalchemy.orm import Session

from app.models.researcher import Researcher
from app.schemas.researcher import (
    ResearcherCreate,
    ResearcherUpdate,
)


def create_researcher(
    db: Session,
    researcher: ResearcherCreate,
):
    new_researcher = Researcher(
        full_name=researcher.full_name,
        email=researcher.email,
        department=researcher.department,
        institution=researcher.institution,
        designation=researcher.designation,
        research_interests=researcher.research_interests,
        skills=researcher.skills,
        affiliation=researcher.affiliation,
    )

    db.add(new_researcher)
    db.commit()
    db.refresh(new_researcher)

    return new_researcher


def get_all_researchers(db: Session):
    return db.query(Researcher).all()


def get_researcher_by_id(
    db: Session,
    researcher_id: int,
):
    return (
        db.query(Researcher)
        .filter(Researcher.id == researcher_id)
        .first()
    )


def update_researcher(
    db: Session,
    researcher_id: int,
    researcher: ResearcherUpdate,
):
    db_researcher = (
        db.query(Researcher)
        .filter(Researcher.id == researcher_id)
        .first()
    )

    if not db_researcher:
        return None

    db_researcher.full_name = researcher.full_name
    db_researcher.email = researcher.email
    db_researcher.department = researcher.department
    db_researcher.institution = researcher.institution
    db_researcher.designation = researcher.designation
    db_researcher.research_interests = researcher.research_interests
    db_researcher.skills = researcher.skills
    db_researcher.affiliation = researcher.affiliation

    db.commit()
    db.refresh(db_researcher)

    return db_researcher


def delete_researcher(
    db: Session,
    researcher_id: int,
):
    db_researcher = (
        db.query(Researcher)
        .filter(Researcher.id == researcher_id)
        .first()
    )

    if not db_researcher:
        return None

    db.delete(db_researcher)
    db.commit()

    return db_researcher