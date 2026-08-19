from typing import Any, Dict

from pydantic import BaseModel


class ResponseCreate(BaseModel):
    form_id: int
    answers: Dict[str, Any]


class ResponseSubmit(BaseModel):
    answers: Dict[str, Any]


class ResponseResponse(BaseModel):
    id: int
    form_id: int
    answers: Dict[str, Any]

    class Config:
        from_attributes = True