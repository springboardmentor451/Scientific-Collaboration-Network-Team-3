from typing import List, Optional

from pydantic import BaseModel


class CollaborationBase(BaseModel):
    researcher1_id: int
    researcher2_id: int
    collaboration_strength: Optional[float] = None


class CollaborationCreate(CollaborationBase):
    pass


class CollaborationUpdate(BaseModel):
    collaboration_strength: float


class CollaborationResponse(CollaborationBase):
    id: int

    class Config:
        from_attributes = True


class NetworkNode(BaseModel):
    id: str
    name: str
    group: Optional[str] = None


class NetworkEdge(BaseModel):
    source: str
    target: str
    weight: float


class NetworkResponse(BaseModel):
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]
