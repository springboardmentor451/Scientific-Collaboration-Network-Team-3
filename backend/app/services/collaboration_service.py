from sqlalchemy.orm import Session
from app.models.collaboration import Collaboration
from app.models.researcher import Researcher
from app.schemas.collaboration import CollaborationCreate, CollaborationUpdate, NetworkResponse, NetworkNode, NetworkEdge


def get_all_collaborations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Collaboration).offset(skip).limit(limit).all()


def get_collaboration(db: Session, collaboration_id: int):
    return db.query(Collaboration).filter(Collaboration.id == collaboration_id).first()


def create_collaboration(db: Session, collab: CollaborationCreate):
    new_collab = Collaboration(**collab.model_dump())
    db.add(new_collab)
    db.commit()
    db.refresh(new_collab)
    return new_collab


def update_collaboration(db: Session, collaboration_id: int, collab: CollaborationUpdate):
    existing = get_collaboration(db, collaboration_id)
    if not existing:
        return None

    data = collab.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)
    return existing


def delete_collaboration(db: Session, collaboration_id: int):
    existing = get_collaboration(db, collaboration_id)
    if not existing:
        return None

    db.delete(existing)
    db.commit()
    return existing


def get_network(db: Session) -> NetworkResponse:
    researchers = db.query(Researcher).all()
    collaborations = db.query(Collaboration).all()
    
    nodes = []
    for r in researchers:
        nodes.append(NetworkNode(
            id=str(r.id),
            name=r.full_name,
            group=r.institution
        ))
        
    edges = []
    for c in collaborations:
        edges.append(NetworkEdge(
            source=str(c.researcher1_id),
            target=str(c.researcher2_id),
            weight=c.collaboration_strength or 1.0
        ))
        
    return NetworkResponse(nodes=nodes, edges=edges)
