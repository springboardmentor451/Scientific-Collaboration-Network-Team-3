# Pydantic schemas for institution CRUD
from pydantic import BaseModel
from typing import Optional


class InstitutionCreate(BaseModel):
    name: str
    city: str
    state: str
    country: str
    website: Optional[str] = None


class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None


class InstitutionResponse(BaseModel):
    id: int
    name: str
    city: str
    state: str
    country: str
    website: Optional[str]

    class Config:
        from_attributes = True