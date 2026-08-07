# Pydantic schemas for publication CRUD + upload
from pydantic import BaseModel


class PublicationCreate(BaseModel):
    title: str
    authors: str
    journal: str
    year: int
    doi: str
    abstract: str
    keywords: str


class PublicationUpdate(BaseModel):
    title: str
    authors: str
    journal: str
    year: int
    doi: str
    abstract: str
    keywords: str


class PublicationResponse(BaseModel):
    id: int
    title: str
    authors: str
    journal: str
    year: int
    doi: str
    abstract: str
    keywords: str

    class Config:
        from_attributes = True