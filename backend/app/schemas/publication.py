from typing import Optional

from pydantic import BaseModel


class PublicationCreate(BaseModel):
    title: str
    authors: str
    publication_type: str = "journal"
    journal: Optional[str] = None
    year: int
    doi: str
    abstract: Optional[str] = None
    keywords: Optional[str] = None
    status: str = "draft"


class PublicationUpdate(BaseModel):
    title: Optional[str] = None
    authors: Optional[str] = None
    publication_type: Optional[str] = None
    journal: Optional[str] = None
    year: Optional[int] = None
    doi: Optional[str] = None
    abstract: Optional[str] = None
    keywords: Optional[str] = None
    status: Optional[str] = None


class PublicationResponse(BaseModel):
    id: int
    title: str
    authors: str
    publication_type: str
    journal: Optional[str]
    year: int
    doi: str
    abstract: Optional[str]
    keywords: Optional[str]
    status: str
    pdf_filename: Optional[str]
    pdf_path: Optional[str]

    class Config:
        from_attributes = True