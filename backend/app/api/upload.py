import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
    Form,
)

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.publication import Publication
from app.models.user import User
from app.security import get_current_user

MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB


router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
)


# ============================================================
# Upload Directory
# ============================================================

UPLOAD_DIR = "uploads/publications"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True,
)


# ============================================================
# Upload Publication PDF
# ============================================================

@router.post("/publication-pdf")
async def upload_publication_pdf(
    title: str = Form(...),
    authors: str = Form(...),
    publication_type: str = Form("journal"),
    journal: str | None = Form(None),
    year: int = Form(...),
    doi: str = Form(...),
    abstract: str | None = Form(None),
    keywords: str | None = Form(None),
    status: str = Form("draft"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # --------------------------------------------------------
    # Check file exists
    # --------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )

    # --------------------------------------------------------
    # Check PDF extension
    # --------------------------------------------------------

    original_filename = file.filename

    if not original_filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    # --------------------------------------------------------
    # Check content type
    # --------------------------------------------------------

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be a PDF.",
        )

    # --------------------------------------------------------
    # Check file size limit (20 MB)
    # --------------------------------------------------------

    content = await file.read()
    if len(content) > MAX_PDF_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {MAX_PDF_SIZE_BYTES // (1024*1024)} MB.",
        )
    await file.seek(0)

    # --------------------------------------------------------
    # Check duplicate DOI
    # --------------------------------------------------------

    existing_publication = (
        db.query(Publication)
        .filter(Publication.doi == doi)
        .first()
    )

    if existing_publication:
        raise HTTPException(
            status_code=400,
            detail="A publication with this DOI already exists.",
        )

    # --------------------------------------------------------
    # Generate unique filename
    # --------------------------------------------------------

    file_extension = os.path.splitext(
        original_filename
    )[1]

    unique_filename = (
        f"{uuid.uuid4().hex}{file_extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename,
    )

    # --------------------------------------------------------
    # Save PDF file
    # --------------------------------------------------------

    try:
        with open(
            file_path,
            "wb",
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save PDF: {str(e)}",
        )

    # --------------------------------------------------------
    # Create Publication
    # --------------------------------------------------------

    publication = Publication(
        title=title,
        authors=authors,
        publication_type=publication_type,
        journal=journal,
        year=year,
        doi=doi,
        abstract=abstract,
        keywords=keywords,
        status=status,
        pdf_filename=original_filename,
        pdf_path=file_path,
    )

    # --------------------------------------------------------
    # Save publication to database
    # --------------------------------------------------------

    try:

        db.add(publication)

        db.commit()

        db.refresh(publication)

    except Exception as e:

        db.rollback()

        # Remove uploaded file if DB operation fails

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save publication: {str(e)}",
        )

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "message": "PDF uploaded successfully",
        "publication_id": publication.id,
        "filename": original_filename,
        "stored_filename": unique_filename,
        "path": file_path,
    }


# ============================================================
# View / Download Publication PDF
# ============================================================

@router.get(
    "/publication/{publication_id}/pdf"
)
def download_publication_pdf(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # --------------------------------------------------------
    # Find publication
    # --------------------------------------------------------

    publication = (
        db.query(Publication)
        .filter(
            Publication.id == publication_id
        )
        .first()
    )

    if not publication:
        raise HTTPException(
            status_code=404,
            detail="Publication not found.",
        )

    # --------------------------------------------------------
    # Check PDF path
    # --------------------------------------------------------

    if not publication.pdf_path:
        raise HTTPException(
            status_code=404,
            detail="PDF not uploaded for this publication.",
        )

    # --------------------------------------------------------
    # Normalize path
    # --------------------------------------------------------

    file_path = publication.pdf_path.replace(
        "\\",
        os.sep,
    )

    # --------------------------------------------------------
    # Check file exists
    # --------------------------------------------------------

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="PDF file not found on server.",
        )

    # --------------------------------------------------------
    # Return PDF
    # --------------------------------------------------------

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=publication.pdf_filename,
    )