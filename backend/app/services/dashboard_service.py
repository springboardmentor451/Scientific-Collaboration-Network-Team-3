from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.researcher import Researcher
from app.models.publication import Publication
from app.models.conference import Conference
from app.models.institution import Institution
from app.models.collaboration import Collaboration


def get_summary(db: Session):
    return {
        "total_researchers": db.query(func.count(Researcher.id)).scalar(),
        "total_publications": db.query(func.count(Publication.id)).scalar(),
        "total_conferences": db.query(func.count(Conference.id)).scalar(),
        "total_institutions": db.query(func.count(Institution.id)).scalar(),
        "total_collaborations": db.query(func.count(Collaboration.id)).scalar(),
    }


def get_publications_per_year(db: Session):
    result = (
        db.query(
            Publication.year,
            func.count(Publication.id).label("count"),
        )
        .group_by(Publication.year)
        .order_by(Publication.year)
        .all()
    )

    return [
        {
            "year": row.year,
            "count": row.count,
        }
        for row in result
    ]


def get_top_institutions(db: Session):
    result = (
        db.query(
            Researcher.institution,
            func.count(Researcher.id).label("researchers"),
        )
        .group_by(Researcher.institution)
        .order_by(func.count(Researcher.id).desc())
        .all()
    )

    return [
        {
            "institution": row.institution,
            "researchers": row.researchers,
        }
        for row in result
    ]


def get_research_areas(db: Session):
    result = db.query(Researcher.research_interests).all()

    counter = {}

    for row in result:
        if row.research_interests:
            areas = [a.strip() for a in row.research_interests.split(",")]

            for area in areas:
                counter[area] = counter.get(area, 0) + 1

    return [
        {
            "area": key,
            "researchers": value,
        }
        for key, value in sorted(
            counter.items(),
            key=lambda x: x[1],
            reverse=True,
        )
    ]