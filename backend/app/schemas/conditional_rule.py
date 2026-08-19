from typing import Optional

from pydantic import BaseModel


class ConditionalRuleCreate(BaseModel):
    form_id: int
    trigger_field: str
    operator: str
    comparison_value: Optional[str] = None
    target_field: str
    action: str


class ConditionalRuleUpdate(BaseModel):
    trigger_field: Optional[str] = None
    operator: Optional[str] = None
    comparison_value: Optional[str] = None
    target_field: Optional[str] = None
    action: Optional[str] = None


class ConditionalRuleResponse(BaseModel):
    id: int
    form_id: int
    trigger_field: str
    operator: str
    comparison_value: Optional[str]
    target_field: str
    action: str

    class Config:
        from_attributes = True