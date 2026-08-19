# Pydantic schemas for conference registration/presentation CRUD
from pydantic import BaseModel
from typing import Optional


class ConferenceCreate(BaseModel):
    name: str
    acronym: Optional[str] = None
    year: int
    location: str
    organizer: str
    website: Optional[str] = None


class ConferenceUpdate(BaseModel):
    name: Optional[str] = None
    acronym: Optional[str] = None
    year: Optional[int] = None
    location: Optional[str] = None
    organizer: Optional[str] = None
    website: Optional[str] = None


class ConferenceResponse(BaseModel):
    id: int
    name: str
    acronym: Optional[str]
    year: int
    location: str
    organizer: str
    website: Optional[str]

    class Config:
        from_attributes = True