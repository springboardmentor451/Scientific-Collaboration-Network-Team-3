from typing import List, Optional

from pydantic import BaseModel


class PublicationAuthorBase(BaseModel):
    researcher_id: int
    author_role: str = "co_author"


class PublicationBase(BaseModel):
    title: str
    authors: str  # text representation
    publication_type: str
    journal: Optional[str] = None
    year: int
    doi: str
    abstract: Optional[str] = None
    keywords: Optional[str] = None
    status: str
    conference_id: Optional[int] = None


class PublicationCreate(PublicationBase):
    # Optional linked researchers during creation
    author_links: Optional[List[PublicationAuthorBase]] = []


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
    conference_id: Optional[int] = None
    author_links: Optional[List[PublicationAuthorBase]] = None


class PublicationAuthorResponse(PublicationAuthorBase):
    id: int

    class Config:
        from_attributes = True


class PublicationResponse(PublicationBase):
    id: int
    pdf_filename: Optional[str] = None
    pdf_path: Optional[str] = None
    author_links: List[PublicationAuthorResponse] = []

    class Config:
        from_attributes = True
