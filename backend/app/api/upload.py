from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"]
)

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.post("/")
async def upload_pdf(
    file: UploadFile = File(...)
):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "message": "PDF uploaded successfully",
        "filename": file.filename
    }