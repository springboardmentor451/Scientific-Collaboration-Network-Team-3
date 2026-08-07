# Publication lifecycle logic (draft -> submitted -> published -> archived)
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
        journal=publication.journal,
        year=publication.year,
        doi=publication.doi,
        abstract=publication.abstract,
        keywords=publication.keywords,
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

    db_publication.title = publication.title
    db_publication.authors = publication.authors
    db_publication.journal = publication.journal
    db_publication.year = publication.year
    db_publication.doi = publication.doi
    db_publication.abstract = publication.abstract
    db_publication.keywords = publication.keywords

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