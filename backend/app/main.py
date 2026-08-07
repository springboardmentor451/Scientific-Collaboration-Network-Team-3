from fastapi import FastAPI

from app.database import Base, engine

# Import Models
from app.models import (
    User,
    Researcher,
    Publication,
    Conference,
    Institution,
)

# Import Routers
from app.api.auth import router as auth_router
from app.api.researcher import router as researcher_router
from app.api.publication import router as publication_router
from app.api.conference import router as conference_router
from app.api.institution import router as institution_router
from app.api.upload import router as upload_router
from app.api.citation import router as citation_router
from app.api.collaboration import router as collaboration_router
from app.api.dashboard import router as dashboard_router


app = FastAPI(
    title="Scientific Collaboration Network Analyzer",
    version="1.0.0",
    description="Backend APIs for SCNA"
)

# Create all database tables
Base.metadata.create_all(bind=engine)

# Register Routers
app.include_router(auth_router)
app.include_router(researcher_router)
app.include_router(publication_router)
app.include_router(conference_router)
app.include_router(institution_router)
app.include_router(upload_router)
app.include_router(citation_router)
app.include_router(collaboration_router)
app.include_router(dashboard_router)



@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Welcome to Scientific Collaboration Network Analyzer Backend"
    }