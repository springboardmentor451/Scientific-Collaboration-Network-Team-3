from typing import Optional

from pydantic import BaseModel, EmailStr


class ResearcherBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str
    institution: str
    designation: str
    research_interests: Optional[str] = None
    skills: Optional[str] = None
    affiliation: Optional[str] = None


class ResearcherCreate(ResearcherBase):
    user_id: Optional[int] = None


class ResearcherUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    institution: Optional[str] = None
    designation: Optional[str] = None
    research_interests: Optional[str] = None
    skills: Optional[str] = None
    affiliation: Optional[str] = None


class ResearcherResponse(ResearcherBase):
    id: int
    user_id: Optional[int] = None
    is_active: bool

    class Config:
        from_attributes = True
