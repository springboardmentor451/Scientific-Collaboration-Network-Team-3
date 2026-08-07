from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_researchers: int
    total_publications: int
    total_conferences: int
    total_institutions: int
    total_collaborations: int


class PublicationsPerYear(BaseModel):
    year: int
    count: int


class TopInstitution(BaseModel):
    institution: str
    researchers: int


class ResearchArea(BaseModel):
    area: str
    researchers: int