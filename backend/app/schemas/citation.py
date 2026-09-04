from typing import Optional
import re
from pydantic import BaseModel, validator


class CitationBase(BaseModel):
    title: str
    authors: str
    year: int
    journal: str
    doi: Optional[str] = None

    @validator("doi")
    def validate_doi(cls, v):
        if v is not None:
            # Simple DOI validation regex: starts with 10., followed by prefix, slash, and suffix
            if not re.match(r"^10\.\d{4,9}/[-._;()/:A-Z0-9]+$", v, re.IGNORECASE):
                raise ValueError("Invalid DOI format")
        return v


class CitationCreate(CitationBase):
    pass


class CitationUpdate(BaseModel):
    title: Optional[str] = None
    authors: Optional[str] = None
    year: Optional[int] = None
    journal: Optional[str] = None
    doi: Optional[str] = None

    @validator("doi")
    def validate_doi(cls, v):
        if v is not None:
            if not re.match(r"^10\.\d{4,9}/[-._;()/:A-Z0-9]+$", v, re.IGNORECASE):
                raise ValueError("Invalid DOI format")
        return v


class CitationResponse(CitationBase):
    id: int

    class Config:
        from_attributes = True
