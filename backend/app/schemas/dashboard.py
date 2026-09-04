from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_researchers: int
    total_publications: int
    total_collaborations: int
    total_citations: int
    total_institutions: int
    total_conferences: int
