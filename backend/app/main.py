import logging
import warnings
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.citation import router as citation_router
from app.api.collaboration import router as collaboration_router
from app.api.conditional_rule import router as conditional_rule_router
from app.api.conference import router as conference_router
from app.api.dashboard import router as dashboard_router
from app.api.form import router as form_router
from app.api.institution import router as institution_router
from app.api.publication import router as publication_router
from app.api.researcher import router as researcher_router
from app.api.response import router as response_router
from app.api.upload import router as upload_router
from app.api.users import router as users_router
from app.core.config import settings
from app.core.redis_client import get_redis

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warn loudly if SECRET_KEY is the default insecure value
    if settings.SECRET_KEY in ("change-me", "", "secret"):
        warnings.warn(
            "⚠️  INSECURE: SECRET_KEY is set to the default value. "
            "Please set a strong, random SECRET_KEY in your .env file before deploying.",
            RuntimeWarning,
            stacklevel=2,
        )
        logger.warning("INSECURE SECRET_KEY detected — please update your .env file.")

    try:
        get_redis().ping()
        logger.info("Redis connection: OK")
    except Exception as e:
        logger.warning("Redis connection failed: %s", e)

    yield


app = FastAPI(
    title="SCNA API",
    description="Scientific Collaboration Network Analyzer — REST API",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
def health():
    redis_ok = False
    try:
        redis_ok = bool(get_redis().ping())
    except Exception:
        redis_ok = False
    return {"status": "ok", "redis": redis_ok}


# ------------------------------------------------------------------
# All API routes are mounted under /api/v1 to match the frontend's
# API_BASE_URL = "http://localhost:8000/api/v1"
# ------------------------------------------------------------------
API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(form_router, prefix=API_PREFIX)
app.include_router(response_router, prefix=API_PREFIX)
app.include_router(conditional_rule_router, prefix=API_PREFIX)
app.include_router(researcher_router, prefix=API_PREFIX)
app.include_router(publication_router, prefix=API_PREFIX)
app.include_router(institution_router, prefix=API_PREFIX)
app.include_router(conference_router, prefix=API_PREFIX)
app.include_router(collaboration_router, prefix=API_PREFIX)
app.include_router(citation_router, prefix=API_PREFIX)
app.include_router(dashboard_router, prefix=API_PREFIX)
app.include_router(upload_router, prefix=API_PREFIX)
app.include_router(users_router, prefix=API_PREFIX)
