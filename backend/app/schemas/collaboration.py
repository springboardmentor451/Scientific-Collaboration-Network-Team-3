from pydantic import BaseModel
from typing import Optional


class CollaborationCreate(BaseModel):
    researcher1_id: int
    researcher2_id: int
    collaboration_strength: float = 1.0


class CollaborationUpdate(BaseModel):
    collaboration_strength: Optional[float] = None


class CollaborationResponse(BaseModel):
    id: int
    researcher1_id: int
    researcher2_id: int
    collaboration_strength: float

    class Config:
        from_attributes = True