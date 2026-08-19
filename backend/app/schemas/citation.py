# Pydantic schemas for citation/reference/DOI CRUD
from pydantic import BaseModel
from typing import Optional


class CitationCreate(BaseModel):
    title: str
    authors: str
    year: int
    journal: str
    doi: Optional[str] = None


class CitationUpdate(BaseModel):
    title: Optional[str] = None
    authors: Optional[str] = None
    year: Optional[int] = None
    journal: Optional[str] = None
    doi: Optional[str] = None


class CitationResponse(BaseModel):
    id: int
    title: str
    authors: str
    year: int
    journal: str
    doi: Optional[str] = None

    class Config:
        from_attributes = True