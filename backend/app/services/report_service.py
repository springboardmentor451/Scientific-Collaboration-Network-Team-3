"""
report_service.py — Report-building logic for publication / researcher /
collaboration / institution reports.
"""

from typing import Dict, Any, List

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.publication import Publication
from app.models.researcher import Researcher
from app.models.collaboration import Collaboration
from app.models.institution import Institution
from app.models.citation import Citation
from app.models.conference import Conference


# ---------------------------------------------------------------------------
# Publication report
# ---------------------------------------------------------------------------

def publication_report(db: Session) -> Dict[str, Any]:
    """Summary stats + per-year breakdown of publications."""
    total = db.query(Publication).count()

    # Count by year
    by_year_raw = (
        db.query(Publication.year, func.count(Publication.id))
        .group_by(Publication.year)
        .order_by(Publication.year)
        .all()
    )
    by_year = {str(yr): cnt for yr, cnt in by_year_raw if yr is not None}

    # Count by status
    by_status_raw = (
        db.query(Publication.status, func.count(Publication.id))
        .group_by(Publication.status)
        .all()
    )
    by_status = {status or "Unknown": cnt for status, cnt in by_status_raw}

    return {
        "total_publications": total,
        "by_year": by_year,
        "by_status": by_status,
    }


# ---------------------------------------------------------------------------
# Researcher report
# ---------------------------------------------------------------------------

def researcher_report(db: Session) -> Dict[str, Any]:
    """Summary stats + active vs inactive count."""
    total = db.query(Researcher).count()
    active = db.query(Researcher).filter(Researcher.is_active == True).count()  # noqa: E712

    # Top institutions (by researcher count)
    top_institutions_raw = (
        db.query(Researcher.institution, func.count(Researcher.id).label("cnt"))
        .group_by(Researcher.institution)
        .order_by(func.count(Researcher.id).desc())
        .limit(10)
        .all()
    )
    top_institutions = [{"institution": inst, "count": cnt} for inst, cnt in top_institutions_raw]

    return {
        "total_researchers": total,
        "active_researchers": active,
        "inactive_researchers": total - active,
        "top_institutions": top_institutions,
    }


# ---------------------------------------------------------------------------
# Collaboration report
# ---------------------------------------------------------------------------

def collaboration_report(db: Session) -> Dict[str, Any]:
    """Summary stats on collaboration network."""
    total = db.query(Collaboration).count()

    # Average collaboration strength
    avg_strength = db.query(func.avg(Collaboration.collaboration_strength)).scalar()

    # Most connected researchers
    r1_counts_raw = (
        db.query(Collaboration.researcher1_id, func.count(Collaboration.id).label("cnt"))
        .group_by(Collaboration.researcher1_id)
        .all()
    )
    r2_counts_raw = (
        db.query(Collaboration.researcher2_id, func.count(Collaboration.id).label("cnt"))
        .group_by(Collaboration.researcher2_id)
        .all()
    )

    combined: Dict[int, int] = {}
    for rid, cnt in r1_counts_raw + r2_counts_raw:
        combined[rid] = combined.get(rid, 0) + cnt

    top_collab = sorted(combined.items(), key=lambda x: x[1], reverse=True)[:10]

    # Enrich with names
    top_collab_named: List[Dict[str, Any]] = []
    for rid, cnt in top_collab:
        r = db.query(Researcher).filter(Researcher.id == rid).first()
        top_collab_named.append({
            "researcher_id": rid,
            "name": r.full_name if r else "Unknown",
            "collaborations": cnt,
        })

    return {
        "total_collaborations": total,
        "average_strength": round(float(avg_strength), 3) if avg_strength else 0.0,
        "top_collaborators": top_collab_named,
    }


# ---------------------------------------------------------------------------
# Institution report
# ---------------------------------------------------------------------------

def institution_report(db: Session) -> Dict[str, Any]:
    """Summary of institutions with researcher counts."""
    total = db.query(Institution).count()

    institutions_raw = db.query(Institution).all()
    data: List[Dict[str, Any]] = []
    for inst in institutions_raw:
        researcher_count = (
            db.query(Researcher)
            .filter(Researcher.institution == inst.name)
            .count()
        )
        data.append({
            "id": inst.id,
            "name": inst.name,
            "city": inst.city,
            "country": inst.country,
            "researcher_count": researcher_count,
        })

    return {
        "total_institutions": total,
        "institutions": data,
    }


# ---------------------------------------------------------------------------
# Admin overview
# ---------------------------------------------------------------------------

def admin_overview_report(db: Session) -> Dict[str, Any]:
    """High-level platform-wide overview."""
    return {
        "total_researchers": db.query(Researcher).count(),
        "total_publications": db.query(Publication).count(),
        "total_collaborations": db.query(Collaboration).count(),
        "total_citations": db.query(Citation).count(),
        "total_institutions": db.query(Institution).count(),
        "total_conferences": db.query(Conference).count(),
    }
