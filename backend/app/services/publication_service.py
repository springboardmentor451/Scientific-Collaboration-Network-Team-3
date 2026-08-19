from sqlalchemy.orm import Session

from app.models.publication import Publication
from app.schemas.publication import (
    PublicationCreate,
    PublicationUpdate,
)


def create_publication(
    db: Session,
    publication: PublicationCreate,
):
    new_publication = Publication(
        title=publication.title,
        authors=publication.authors,
        publication_type=publication.publication_type,
        journal=publication.journal,
        year=publication.year,
        doi=publication.doi,
        abstract=publication.abstract,
        keywords=publication.keywords,
        status=publication.status,
    )

    db.add(new_publication)
    db.commit()
    db.refresh(new_publication)

    return new_publication


def get_all_publications(db: Session):
    return db.query(Publication).all()


def get_publication_by_id(
    db: Session,
    publication_id: int,
):
    return (
        db.query(Publication)
        .filter(Publication.id == publication_id)
        .first()
    )


def update_publication(
    db: Session,
    publication_id: int,
    publication: PublicationUpdate,
):
    db_publication = (
        db.query(Publication)
        .filter(Publication.id == publication_id)
        .first()
    )

    if not db_publication:
        return None

    update_data = publication.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            db_publication,
            field,
            value
        )

    db.commit()
    db.refresh(db_publication)

    return db_publication


def delete_publication(
    db: Session,
    publication_id: int,
):
    db_publication = (
        db.query(Publication)
        .filter(Publication.id == publication_id)
        .first()
    )

    if not db_publication:
        return None

    db.delete(db_publication)
    db.commit()

    return db_publication