from typing import Optional

from pydantic import BaseModel


class ConferenceBase(BaseModel):
    name: str
    acronym: Optional[str] = None
    year: int
    location: str
    organizer: str
    website: Optional[str] = None


class ConferenceCreate(ConferenceBase):
    pass


class ConferenceUpdate(BaseModel):
    name: Optional[str] = None
    acronym: Optional[str] = None
    year: Optional[int] = None
    location: Optional[str] = None
    organizer: Optional[str] = None
    website: Optional[str] = None


class ConferenceResponse(ConferenceBase):
    id: int

    class Config:
        from_attributes = True
