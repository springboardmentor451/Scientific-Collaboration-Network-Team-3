# Pydantic schemas for researcher profile CRUD
from pydantic import BaseModel, EmailStr


class ResearcherCreate(BaseModel):
    full_name: str
    email: EmailStr
    department: str
    institution: str
    designation: str
    research_interests: str
    skills: str
    affiliation: str


class ResearcherUpdate(BaseModel):
    full_name: str
    email: EmailStr
    department: str
    institution: str
    designation: str
    research_interests: str
    skills: str
    affiliation: str


class ResearcherResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    department: str
    institution: str
    designation: str
    research_interests: str
    skills: str
    affiliation: str

    class Config:
        from_attributes = True