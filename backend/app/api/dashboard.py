from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.dashboard import (
    DashboardSummary,
    PublicationsPerYear,
    TopInstitution,
    ResearchArea,
)

from app.services import dashboard_service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/summary",
    response_model=DashboardSummary,
)
def dashboard_summary(db: Session = Depends(get_db)):
    return dashboard_service.get_summary(db)


@router.get(
    "/publications-per-year",
    response_model=list[PublicationsPerYear],
)
def publications_per_year(db: Session = Depends(get_db)):
    return dashboard_service.get_publications_per_year(db)


@router.get(
    "/top-institutions",
    response_model=list[TopInstitution],
)
def top_institutions(db: Session = Depends(get_db)):
    return dashboard_service.get_top_institutions(db)


@router.get(
    "/research-areas",
    response_model=list[ResearchArea],
)
def research_areas(db: Session = Depends(get_db)):
    return dashboard_service.get_research_areas(db)