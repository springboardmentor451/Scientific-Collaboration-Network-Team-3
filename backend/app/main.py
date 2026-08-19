from fastapi import FastAPI

from app.database import Base, engine

from app.api.conditional_rule import router as conditional_rule_router
from app.api.response import router as response_router
from app.api.form import router as form_router


# ============================================================
# IMPORT MODELS
# ============================================================

from app.models import (
    User,
    Researcher,
    Publication,
    Conference,
    Institution,
    OTPVerification,
    Response,
    ConditionalRule,
)

from app.models.form import Form


# ============================================================
# IMPORT ROUTERS
# ============================================================

from app.api.auth import router as auth_router
from app.api.researcher import router as researcher_router
from app.api.publication import router as publication_router
from app.api.conference import router as conference_router
from app.api.institution import router as institution_router
from app.api.upload import router as upload_router
from app.api.citation import router as citation_router
from app.api.collaboration import router as collaboration_router
from app.api.dashboard import router as dashboard_router


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="Scientific Collaboration Network Analyzer",
    version="1.0.0",
    description="Backend APIs for SCNA"
)


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# REGISTER ROUTERS
# ============================================================

app.include_router(auth_router)
app.include_router(researcher_router)
app.include_router(publication_router)
app.include_router(conference_router)
app.include_router(institution_router)
app.include_router(upload_router)
app.include_router(citation_router)
app.include_router(collaboration_router)
app.include_router(dashboard_router)
app.include_router(form_router)

# Conditional Rules
app.include_router(
    conditional_rule_router
)

# Responses
app.include_router(
    response_router
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Welcome to Scientific Collaboration Network Analyzer Backend"
    }