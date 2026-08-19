from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.conditional_rule import (
    ConditionalRuleCreate,
    ConditionalRuleResponse,
)
from app.services.conditional_rule_service import (
    create_rule,
    get_rules,
    delete_rule,
    evaluate_form_rules,
)


router = APIRouter(
    prefix="/conditional-rules",
    tags=["Conditional Rules"],
)


# ============================================================
# CREATE CONDITIONAL RULE
# ============================================================

@router.post(
    "/forms/{form_id}",
    response_model=ConditionalRuleResponse,
)
def create_conditional_rule(
    form_id: int,
    rule: ConditionalRuleCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_rule(
            db=db,
            form_id=form_id,
            rule=rule,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# GET ALL RULES FOR A FORM
# ============================================================

@router.get(
    "/forms/{form_id}",
    response_model=list[ConditionalRuleResponse],
)
def get_conditional_rules(
    form_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_rules(
            db=db,
            form_id=form_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# DELETE CONDITIONAL RULE
# ============================================================

@router.delete(
    "/{rule_id}",
)
def delete_conditional_rule(
    rule_id: int,
    db: Session = Depends(get_db),
):
    result = delete_rule(
        db=db,
        rule_id=rule_id,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Conditional rule not found.",
        )

    return {
        "message": "Conditional rule deleted successfully",
        "rule_id": rule_id,
    }


# ============================================================
# EVALUATE CONDITIONAL RULES
# ============================================================

@router.post(
    "/forms/{form_id}/evaluate",
)
def evaluate_rules(
    form_id: int,
    answers: Dict[str, Any],
    db: Session = Depends(get_db),
):
    try:
        return evaluate_form_rules(
            db=db,
            form_id=form_id,
            answers=answers,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )