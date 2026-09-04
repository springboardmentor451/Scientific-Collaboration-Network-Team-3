from sqlalchemy.orm import Session
from app.models.researcher import Researcher
from app.models.publication import Publication
from app.models.collaboration import Collaboration
from app.models.citation import Citation
from app.models.institution import Institution
from app.models.conference import Conference
from app.schemas.dashboard import DashboardStats

def get_dashboard_stats(db: Session) -> DashboardStats:
    total_researchers = db.query(Researcher).count()
    total_publications = db.query(Publication).count()
    total_collaborations = db.query(Collaboration).count()
    total_citations = db.query(Citation).count()
    total_institutions = db.query(Institution).count()
    total_conferences = db.query(Conference).count()

    return DashboardStats(
        total_researchers=total_researchers,
        total_publications=total_publications,
        total_collaborations=total_collaborations,
        total_citations=total_citations,
        total_institutions=total_institutions,
        total_conferences=total_conferences
    )
