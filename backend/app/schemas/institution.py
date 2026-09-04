from typing import Optional

from pydantic import BaseModel


class InstitutionBase(BaseModel):
    name: str
    city: str
    state: str
    country: str
    website: Optional[str] = None


class InstitutionCreate(InstitutionBase):
    pass


class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None


class InstitutionResponse(InstitutionBase):
    id: int

    class Config:
        from_attributes = True
