from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.publication import Publication
from app.models.publication_author import PublicationAuthor
from app.schemas.publication import PublicationCreate, PublicationUpdate


def create_publication(db: Session, pub_data: PublicationCreate) -> Publication:
    # Separate the junction table entries
    data_dict = pub_data.model_dump(exclude={"author_links"})
    
    db_pub = Publication(**data_dict)
    db.add(db_pub)
    db.commit()
    db.refresh(db_pub)
    
    if pub_data.author_links:
        for link in pub_data.author_links:
            pub_auth = PublicationAuthor(
                publication_id=db_pub.id,
                researcher_id=link.researcher_id,
                author_role=link.author_role
            )
            db.add(pub_auth)
        db.commit()
        db.refresh(db_pub)
        
    return db_pub


def get_publication(db: Session, pub_id: int) -> Optional[Publication]:
    return db.query(Publication).filter(Publication.id == pub_id).first()


def get_publications(
    db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None
) -> List[Publication]:
    query = db.query(Publication)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Publication.title.ilike(search_filter))
            | (Publication.authors.ilike(search_filter))
            | (Publication.keywords.ilike(search_filter))
            | (Publication.doi.ilike(search_filter))
        )
    return query.offset(skip).limit(limit).all()


def update_publication(
    db: Session, pub_id: int, pub_data: PublicationUpdate
) -> Optional[Publication]:
    db_pub = get_publication(db, pub_id)
    if not db_pub:
        return None

    update_data = pub_data.model_dump(exclude_unset=True, exclude={"author_links"})
    for key, value in update_data.items():
        setattr(db_pub, key, value)
        
    if pub_data.author_links is not None:
        # Recreate author links: simple approach is drop all existing and recreate
        db.query(PublicationAuthor).filter(PublicationAuthor.publication_id == pub_id).delete()
        for link in pub_data.author_links:
            pub_auth = PublicationAuthor(
                publication_id=pub_id,
                researcher_id=link.researcher_id,
                author_role=link.author_role
            )
            db.add(pub_auth)

    db.commit()
    db.refresh(db_pub)
    return db_pub


def delete_publication(db: Session, pub_id: int) -> bool:
    db_pub = get_publication(db, pub_id)
    if not db_pub:
        return False
        
    # Delete junction table links first
    db.query(PublicationAuthor).filter(PublicationAuthor.publication_id == pub_id).delete()
    db.delete(db_pub)
    db.commit()
    return True
