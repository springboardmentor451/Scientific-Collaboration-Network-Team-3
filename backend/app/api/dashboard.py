from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardStats
from app.security import get_current_user
from app.services.dashboard_service import get_dashboard_stats

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats", response_model=DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_dashboard_stats(db)